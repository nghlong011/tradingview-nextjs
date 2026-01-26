import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { DatabaseAdapter, AccessLog, LogQueryParams, LogQueryResult, Statistics } from './db-adapter';

let dbInstance: Database.Database | null = null;

function getDatabase(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  const dbDir = join(process.cwd(), 'db');
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = join(dbDir, 'access-logs.db');
  dbInstance = new Database(dbPath);

  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS access_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      view TEXT NOT NULL,
      block_reason TEXT,
      organization TEXT,
      asn INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_agent TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_ip ON access_logs(ip);
    CREATE INDEX IF NOT EXISTS idx_view ON access_logs(view);
    CREATE INDEX IF NOT EXISTS idx_timestamp ON access_logs(timestamp);
    CREATE INDEX IF NOT EXISTS idx_block_reason ON access_logs(block_reason);
  `);

  return dbInstance;
}

export class SQLiteAdapter implements DatabaseAdapter {
  initialize(): void {
    getDatabase(); // Khởi tạo database
  }

  saveAccessLog(log: AccessLog): void {
    try {
      const db = getDatabase();
      const stmt = db.prepare(`
        INSERT INTO access_logs (ip, view, block_reason, organization, asn, user_agent)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        log.ip,
        log.view,
        log.block_reason || null,
        log.organization || null,
        log.asn || null,
        log.user_agent || null
      );
    } catch (error) {
      console.error('Error saving access log:', error);
      throw error;
    }
  }

  getAccessLogs(params: LogQueryParams = {}): LogQueryResult {
    try {
      const db = getDatabase();
      const page = params.page || 1;
      const limit = params.limit || 50;
      const offset = (page - 1) * limit;

      const conditions: string[] = [];
      const values: any[] = [];

      if (params.ip) {
        conditions.push('ip LIKE ?');
        values.push(`%${params.ip}%`);
      }

      if (params.view) {
        conditions.push('view = ?');
        values.push(params.view);
      }

      if (params.block_reason) {
        conditions.push('block_reason = ?');
        values.push(params.block_reason);
      }

      if (params.startDate) {
        conditions.push('timestamp >= ?');
        values.push(params.startDate);
      }

      if (params.endDate) {
        conditions.push('timestamp <= ?');
        values.push(params.endDate);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const countStmt = db.prepare(`SELECT COUNT(*) as total FROM access_logs ${whereClause}`);
      const countResult = countStmt.get(...values) as { total: number };
      const total = countResult.total;

      const stmt = db.prepare(`
        SELECT * FROM access_logs
        ${whereClause}
        ORDER BY timestamp DESC
        LIMIT ? OFFSET ?
      `);
      
      const logs = stmt.all(...values, limit, offset) as AccessLog[];

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

  getStatistics(): Statistics {
    try {
      const db = getDatabase();

      const totalStmt = db.prepare('SELECT COUNT(*) as total FROM access_logs');
      const totalResult = totalStmt.get() as { total: number };

      const viewOneStmt = db.prepare("SELECT COUNT(*) as count FROM access_logs WHERE view = 'ViewOne'");
      const viewOneResult = viewOneStmt.get() as { count: number };

      const viewTwoStmt = db.prepare("SELECT COUNT(*) as count FROM access_logs WHERE view = 'ViewTwo'");
      const viewTwoResult = viewTwoStmt.get() as { count: number };

      const blockReasonStmt = db.prepare(`
        SELECT block_reason, COUNT(*) as count
        FROM access_logs
        WHERE block_reason IS NOT NULL
        GROUP BY block_reason
        ORDER BY count DESC
      `);
      const blockReasonResults = blockReasonStmt.all() as Array<{ block_reason: string; count: number }>;
      const blockReasons: Record<string, number> = {};
      blockReasonResults.forEach((row) => {
        blockReasons[row.block_reason] = row.count;
      });

      const topIPsStmt = db.prepare(`
        SELECT ip, COUNT(*) as count
        FROM access_logs
        GROUP BY ip
        ORDER BY count DESC
        LIMIT 10
      `);
      const topIPs = topIPsStmt.all() as Array<{ ip: string; count: number }>;

      return {
        totalRequests: totalResult.total,
        viewOneCount: viewOneResult.count,
        viewTwoCount: viewTwoResult.count,
        blockReasons,
        topIPs,
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }
}
