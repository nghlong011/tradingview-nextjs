import { Pool, QueryResult } from 'pg';
import type { DatabaseAdapter, AccessLog, LogQueryParams, LogQueryResult, Statistics } from './db-adapter';

let poolInstance: Pool | null = null;

function getPool(): Pool {
  if (poolInstance) {
    return poolInstance;
  }

  // Lấy connection string từ environment variable
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('POSTGRES_URL or DATABASE_URL environment variable is required for Postgres');
  }

  poolInstance = new Pool({
    connectionString,
    // Connection pool settings
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  return poolInstance;
}

export class PostgresAdapter implements DatabaseAdapter {
  async initialize(): Promise<void> {
    const pool = getPool();
    
    // Tạo bảng nếu chưa tồn tại
    await pool.query(`
      CREATE TABLE IF NOT EXISTS access_logs (
        id SERIAL PRIMARY KEY,
        ip TEXT NOT NULL,
        view TEXT NOT NULL,
        block_reason TEXT,
        organization TEXT,
        asn INTEGER,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_agent TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_ip ON access_logs(ip);
      CREATE INDEX IF NOT EXISTS idx_view ON access_logs(view);
      CREATE INDEX IF NOT EXISTS idx_timestamp ON access_logs(timestamp);
      CREATE INDEX IF NOT EXISTS idx_block_reason ON access_logs(block_reason);
    `);
  }

  async saveAccessLog(log: AccessLog): Promise<void> {
    try {
      const pool = getPool();
      await pool.query(
        `INSERT INTO access_logs (ip, view, block_reason, organization, asn, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          log.ip,
          log.view,
          log.block_reason || null,
          log.organization || null,
          log.asn || null,
          log.user_agent || null,
        ]
      );
    } catch (error) {
      console.error('Error saving access log:', error);
      throw error;
    }
  }

  async getAccessLogs(params: LogQueryParams = {}): Promise<LogQueryResult> {
    try {
      const pool = getPool();
      const page = params.page || 1;
      const limit = params.limit || 50;
      const offset = (page - 1) * limit;

      const conditions: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (params.ip) {
        conditions.push(`ip LIKE $${paramIndex}`);
        values.push(`%${params.ip}%`);
        paramIndex++;
      }

      if (params.view) {
        conditions.push(`view = $${paramIndex}`);
        values.push(params.view);
        paramIndex++;
      }

      if (params.block_reason) {
        conditions.push(`block_reason = $${paramIndex}`);
        values.push(params.block_reason);
        paramIndex++;
      }

      if (params.startDate) {
        conditions.push(`timestamp >= $${paramIndex}`);
        values.push(params.startDate);
        paramIndex++;
      }

      if (params.endDate) {
        conditions.push(`timestamp <= $${paramIndex}`);
        values.push(params.endDate);
        paramIndex++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Đếm tổng số records
      const countQuery = `SELECT COUNT(*) as total FROM access_logs ${whereClause}`;
      const countResult = await pool.query(countQuery, values);
      const total = parseInt(countResult.rows[0].total, 10);

      // Lấy logs với pagination
      const query = `
        SELECT * FROM access_logs
        ${whereClause}
        ORDER BY timestamp DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      const result = await pool.query(query, [...values, limit, offset]);
      const logs = result.rows.map((row) => ({
        ...row,
        id: parseInt(row.id, 10),
        asn: row.asn ? parseInt(row.asn, 10) : null,
      })) as AccessLog[];

      return {
        logs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error getting access logs:', error);
      throw error;
    }
  }

  async getStatistics(): Promise<Statistics> {
    try {
      const pool = getPool();

      const totalResult = await pool.query('SELECT COUNT(*) as total FROM access_logs');
      const totalRequests = parseInt(totalResult.rows[0].total, 10);

      const viewOneResult = await pool.query("SELECT COUNT(*) as count FROM access_logs WHERE view = 'ViewOne'");
      const viewOneCount = parseInt(viewOneResult.rows[0].count, 10);

      const viewTwoResult = await pool.query("SELECT COUNT(*) as count FROM access_logs WHERE view = 'ViewTwo'");
      const viewTwoCount = parseInt(viewTwoResult.rows[0].count, 10);

      const blockReasonResult = await pool.query(`
        SELECT block_reason, COUNT(*) as count
        FROM access_logs
        WHERE block_reason IS NOT NULL
        GROUP BY block_reason
        ORDER BY count DESC
      `);
      const blockReasons: Record<string, number> = {};
      blockReasonResult.rows.forEach((row) => {
        blockReasons[row.block_reason] = parseInt(row.count, 10);
      });

      const topIPsResult = await pool.query(`
        SELECT ip, COUNT(*) as count
        FROM access_logs
        GROUP BY ip
        ORDER BY count DESC
        LIMIT 10
      `);
      const topIPs = topIPsResult.rows.map((row) => ({
        ip: row.ip,
        count: parseInt(row.count, 10),
      }));

      return {
        totalRequests,
        viewOneCount,
        viewTwoCount,
        blockReasons,
        topIPs,
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }
}
