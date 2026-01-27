/**
 * Database adapter interface để hỗ trợ cả SQLite và Postgres
 */

export interface AccessLog {
  id?: number;
  ip: string;
  view: 'ViewOne' | 'ViewTwo';
  block_reason?: string | null;
  organization?: string | null;
  asn?: number | null;
  timestamp?: string;
  user_agent?: string | null;
  user_agent_parsed?: string | null; // JSON string của parsed user-agent
  headers?: string | null; // JSON string của headers
}

export interface LogQueryParams {
  page?: number;
  limit?: number;
  ip?: string;
  view?: 'ViewOne' | 'ViewTwo';
  block_reason?: string;
  startDate?: string;
  endDate?: string;
}

export interface LogQueryResult {
  logs: AccessLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Statistics {
  totalRequests: number;
  viewOneCount: number;
  viewTwoCount: number;
  blockReasons: Record<string, number>;
  topIPs: Array<{ ip: string; count: number }>;
}

export interface DatabaseAdapter {
  saveAccessLog(log: AccessLog): void | Promise<void>;
  getAccessLogs(params: LogQueryParams): LogQueryResult | Promise<LogQueryResult>;
  getStatistics(): Statistics | Promise<Statistics>;
  initialize(): void | Promise<void>;
}
