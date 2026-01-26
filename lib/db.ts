import { SQLiteAdapter } from './db-sqlite';
import { PostgresAdapter } from './db-postgres';
import type { DatabaseAdapter, AccessLog, LogQueryParams, LogQueryResult, Statistics } from './db-adapter';

// Export types
export type { AccessLog, LogQueryParams, LogQueryResult, Statistics };

// Singleton instance cho database adapter
let dbAdapter: DatabaseAdapter | null = null;
let initPromise: Promise<void> | null = null;

/**
 * Lấy database adapter (SQLite hoặc Postgres)
 * Tự động chọn dựa trên environment variable
 */
function getAdapter(): DatabaseAdapter {
  if (dbAdapter) {
    return dbAdapter;
  }

  // Kiểm tra xem có Postgres connection string không
  const usePostgres = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  if (usePostgres) {
    console.log('Using Postgres database');
    dbAdapter = new PostgresAdapter();
  } else {
    console.log('Using SQLite database (local development)');
    dbAdapter = new SQLiteAdapter();
  }

  // Khởi tạo database (lazy initialization)
  if (!initPromise) {
    const initResult = dbAdapter.initialize();
    if (initResult instanceof Promise) {
      // Postgres adapter returns Promise
      initPromise = initResult.catch((error) => {
        console.error('Error initializing database:', error);
        initPromise = null; // Reset để có thể retry
      });
    } else {
      // SQLite adapter returns void
      initPromise = Promise.resolve();
    }
  }

  return dbAdapter;
}

/**
 * Đảm bảo database được khởi tạo (cho Postgres)
 */
async function ensureInitialized(): Promise<void> {
  if (initPromise) {
    await initPromise;
  }
}

/**
 * Lưu access log vào database
 */
export async function saveAccessLog(log: AccessLog): Promise<void> {
  console.log('[DB.TS] saveAccessLog called with:', {
    ip: log.ip,
    view: log.view,
    block_reason: log.block_reason,
    organization: log.organization,
  });
  
  try {
    console.log('[DB.TS] Ensuring database initialized...');
    await ensureInitialized();
    console.log('[DB.TS] Database initialized, getting adapter...');
    
    const adapter = getAdapter();
    console.log('[DB.TS] Adapter obtained, calling saveAccessLog...');
    
    const result = adapter.saveAccessLog(log);
    
    // Nếu là Promise (Postgres), await nó
    if (result instanceof Promise) {
      console.log('[DB.TS] Waiting for Postgres saveAccessLog promise...');
      await result;
      console.log('[DB.TS] Postgres saveAccessLog completed');
    } else {
      console.log('[DB.TS] SQLite saveAccessLog completed (synchronous)');
    }
    
    // Log success
    console.log('[DB.TS] Successfully saved access log:', {
      ip: log.ip,
      view: log.view,
      block_reason: log.block_reason,
    });
  } catch (error: unknown) {
    // Log chi tiết lỗi để debug
    const err = error as Error;
    console.error('[DB.TS] Error saving access log:', {
      error: err?.message || String(error),
      errorStack: err?.stack,
      errorName: err?.name,
      log: {
        ip: log.ip,
        view: log.view,
        block_reason: log.block_reason,
        hasHeaders: !!log.headers,
        organization: log.organization,
      },
    });
    // Throw lại để caller có thể catch
    throw error;
  }
}

/**
 * Lấy danh sách access logs với pagination và filters
 */
export async function getAccessLogs(params: LogQueryParams = {}): Promise<LogQueryResult> {
  try {
    const adapter = getAdapter();
    const result = adapter.getAccessLogs(params);
    
    // Nếu là Promise (Postgres), await nó
    if (result instanceof Promise) {
      return await result;
    }
    
    return result;
  } catch (error) {
    console.error('Error getting access logs:', error);
    throw error;
  }
}

/**
 * Lấy thống kê tổng quan
 */
export async function getStatistics(): Promise<Statistics> {
  try {
    const adapter = getAdapter();
    const result = adapter.getStatistics();
    
    // Nếu là Promise (Postgres), await nó
    if (result instanceof Promise) {
      return await result;
    }
    
    return result;
  } catch (error) {
    console.error('Error getting statistics:', error);
    throw error;
  }
}
