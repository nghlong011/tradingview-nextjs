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

  // Xử lý SSL config để tránh warning
  // Parse connection string để loại bỏ sslmode parameter (nếu có)
  // và set SSL config một cách rõ ràng
  let cleanConnectionString = connectionString;
  let sslConfig: boolean | { rejectUnauthorized: boolean } = false;
  
  try {
    const url = new URL(connectionString);
    const sslMode = url.searchParams.get('sslmode');
    
    // Nếu có sslmode trong connection string, loại bỏ nó
    // và set SSL config rõ ràng thay thế
    if (sslMode) {
      url.searchParams.delete('sslmode');
      cleanConnectionString = url.toString();
      
      // Với các cloud provider (Neon, Supabase, Railway), 
      // thường chỉ cần SSL mà không cần verify certificate
      // 'require', 'prefer' → rejectUnauthorized: false
      // 'verify-ca', 'verify-full' → rejectUnauthorized: true
      if (sslMode === 'verify-full' || sslMode === 'verify-ca') {
        sslConfig = { rejectUnauthorized: true };
      } else {
        // 'require' hoặc 'prefer' hoặc không có
        sslConfig = { rejectUnauthorized: false };
      }
    } else {
      // Không có sslmode trong URL
      // Nếu là production (Vercel), mặc định dùng SSL
      const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
      if (isProduction) {
        // Cloud providers thường yêu cầu SSL nhưng không cần verify certificate
        sslConfig = { rejectUnauthorized: false };
      }
    }
  } catch (error) {
    // Nếu không parse được URL (có thể là connection string không phải URL format)
    // Giữ nguyên connection string và không set SSL
    console.warn('Could not parse connection string as URL, using as-is:', error);
  }

  // Tối ưu cho serverless environment (Vercel)
  // Trên serverless, mỗi request có thể chạy trên instance khác nhau
  // nên connection pool không được share giữa các requests
  const isServerless = process.env.VERCEL === '1';
  
  poolInstance = new Pool({
    connectionString: cleanConnectionString,
    ssl: sslConfig,
    // Connection pool settings - tối ưu cho serverless
    max: isServerless ? 1 : 20, // Serverless: 1 connection per instance
    min: 0, // Không giữ connection khi idle (quan trọng cho serverless)
    idleTimeoutMillis: 10000, // Giảm idle timeout
    connectionTimeoutMillis: 10000, // Tăng connection timeout từ 2s lên 10s
    // Statement timeout để tránh query chạy quá lâu
    statement_timeout: 5000, // 5 seconds
    // Query timeout
    query_timeout: 5000,
  });
  
  // Xử lý connection errors
  poolInstance.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  return poolInstance;
}

/**
 * Retry helper với exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 100
): Promise<T> {
  let lastError: Error | null = null;
  
  console.log(`[RETRY] Starting retryWithBackoff, maxRetries: ${maxRetries}`);
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`[RETRY] Attempt ${attempt + 1}/${maxRetries}`);
      const result = await fn();
      console.log(`[RETRY] Attempt ${attempt + 1} succeeded`);
      return result;
    } catch (error: any) {
      lastError = error;
      console.error(`[RETRY] Attempt ${attempt + 1} failed:`, {
        error: error?.message || String(error),
        errorCode: error?.code,
        errorName: error?.name,
      });
      
      // Không retry nếu là lỗi không phải connection/timeout
      if (error?.code !== 'ETIMEDOUT' && 
          error?.code !== 'ECONNREFUSED' && 
          error?.code !== 'ENOTFOUND' &&
          !error?.message?.includes('timeout') &&
          !error?.message?.includes('Connection terminated')) {
        console.log(`[RETRY] Error is not retryable, throwing immediately`);
        throw error;
      }
      
      // Nếu không phải lần thử cuối, đợi trước khi retry
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`[RETRY] Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`[RETRY] All ${maxRetries} attempts failed`);
  throw lastError || new Error('Max retries exceeded');
}

export class PostgresAdapter implements DatabaseAdapter {
  async initialize(): Promise<void> {
    const pool = getPool();
    
    // Tạo bảng nếu chưa tồn tại với retry
    await retryWithBackoff(async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS access_logs (
          id SERIAL PRIMARY KEY,
          ip TEXT NOT NULL,
          view TEXT NOT NULL,
          block_reason TEXT,
          organization TEXT,
          asn INTEGER,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          user_agent TEXT,
          user_agent_parsed TEXT,
          headers TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_ip ON access_logs(ip);
        CREATE INDEX IF NOT EXISTS idx_view ON access_logs(view);
        CREATE INDEX IF NOT EXISTS idx_timestamp ON access_logs(timestamp);
        CREATE INDEX IF NOT EXISTS idx_block_reason ON access_logs(block_reason);
      `);
      
      // Migration: Thêm cột headers và user_agent_parsed nếu chưa tồn tại
      try {
        await pool.query(`ALTER TABLE access_logs ADD COLUMN IF NOT EXISTS headers TEXT`);
      } catch (error) {
        // Cột đã tồn tại hoặc lỗi khác, bỏ qua
        console.warn('Error adding headers column (may already exist):', error);
      }
      
      try {
        await pool.query(`ALTER TABLE access_logs ADD COLUMN IF NOT EXISTS user_agent_parsed TEXT`);
      } catch (error) {
        // Cột đã tồn tại hoặc lỗi khác, bỏ qua
        console.warn('Error adding user_agent_parsed column (may already exist):', error);
      }

      try {
        await pool.query(`ALTER TABLE access_logs ADD COLUMN IF NOT EXISTS botd_result TEXT`);
      } catch (error) {
        console.warn('Error adding botd_result column (may already exist):', error);
      }

      // Tạo bảng settings
      await pool.query(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    });
  }

  async saveAccessLog(log: AccessLog): Promise<void> {
    console.log('[POSTGRES] saveAccessLog called');
    const pool = getPool();
    console.log('[POSTGRES] Pool obtained');
    
    // Retry với exponential backoff
    try {
      console.log('[POSTGRES] Starting retryWithBackoff...');
      await retryWithBackoff(async () => {
        console.log('[POSTGRES] Inside retryWithBackoff, executing query...');
        const result = await pool.query(
          `INSERT INTO access_logs (ip, view, block_reason, organization, asn, user_agent, user_agent_parsed, headers, botd_result)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id`,
          [
            log.ip,
            log.view,
            log.block_reason || null,
            log.organization || null,
            log.asn || null,
            log.user_agent || null,
            log.user_agent_parsed || null,
            log.headers || null,
            log.botd_result || null,
          ]
        );
        
        console.log('[POSTGRES] Query executed successfully, ID:', result.rows[0]?.id);
        return result;
      }, 2, 200); // 2 retries với delay ban đầu 200ms
      
      console.log('[POSTGRES] saveAccessLog completed successfully');
    } catch (error: any) {
      console.error('[POSTGRES] Error in saveAccessLog:', {
        error: error?.message || String(error),
        errorStack: error?.stack,
        errorName: error?.name,
        errorCode: error?.code,
      });
      throw error;
    }
  }

  async getAccessLogs(params: LogQueryParams = {}): Promise<LogQueryResult> {
    const pool = getPool();
    
    return await retryWithBackoff(async () => {
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
    });
  }

  async getStatistics(): Promise<Statistics> {
    const pool = getPool();
    
    return await retryWithBackoff(async () => {

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
    });
  }

  async getSetting(key: string): Promise<string | null> {
    const pool = getPool();
    try {
      const result = await pool.query('SELECT value FROM settings WHERE key = $1', [key]);
      return result.rows[0]?.value || null;
    } catch (error) {
      console.error('Error getting setting:', error);
      return null;
    }
  }

  async setSetting(key: string, value: string): Promise<void> {
    const pool = getPool();
    try {
      await pool.query(
        `INSERT INTO settings (key, value, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT(key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
        [key, value]
      );
    } catch (error) {
      console.error('Error setting setting:', error);
      throw error;
    }
  }
}
