'use client';

import { useEffect, useState } from 'react';

interface AccessLog {
  id: number;
  ip: string;
  view: 'ViewOne' | 'ViewTwo';
  block_reason: string | null;
  organization: string | null;
  asn: number | null;
  timestamp: string;
  user_agent: string | null;
}

interface LogQueryResult {
  logs: AccessLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Statistics {
  totalRequests: number;
  viewOneCount: number;
  viewTwoCount: number;
  blockReasons: Record<string, number>;
  topIPs: Array<{ ip: string; count: number }>;
}

export default function AdminPage() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    ip: '',
    view: '' as '' | 'ViewOne' | 'ViewTwo',
    block_reason: '',
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });

      if (filters.ip) params.append('ip', filters.ip);
      if (filters.view) params.append('view', filters.view);
      if (filters.block_reason) params.append('block_reason', filters.block_reason);

      const response = await fetch(`/api/admin/logs?${params.toString()}`);
      const data: LogQueryResult = await response.json();
      
      setLogs(data.logs);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data: Statistics = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [page]);

  useEffect(() => {
    // Reset to page 1 when filters change
    if (page === 1) {
      fetchLogs();
    } else {
      setPage(1);
    }
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const blockReasonLabels: Record<string, string> = {
    NO_IP: 'Không có IP',
    LOCALHOST_PRODUCTION: 'Localhost trong production',
    NO_ASN_ORGANIZATION: 'Không có ASN organization',
    PROXY_VPN_DETECTED: 'Phát hiện Proxy/VPN',
    BUSINESS_IP_DETECTED: 'Phát hiện IP doanh nghiệp',
    ERROR: 'Lỗi xử lý',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin - Thống kê IP truy cập</h1>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="text-sm text-slate-400 mb-1">Tổng số request</div>
              <div className="text-2xl font-bold">{stats.totalRequests}</div>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="text-sm text-slate-400 mb-1">ViewOne</div>
              <div className="text-2xl font-bold text-emerald-400">{stats.viewOneCount}</div>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="text-sm text-slate-400 mb-1">ViewTwo</div>
              <div className="text-2xl font-bold text-red-400">{stats.viewTwoCount}</div>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="text-sm text-slate-400 mb-1">Tỷ lệ ViewOne</div>
              <div className="text-2xl font-bold text-sky-400">
                {stats.totalRequests > 0
                  ? ((stats.viewOneCount / stats.totalRequests) * 100).toFixed(1)
                  : 0}%
              </div>
            </div>
          </div>
        )}

        {/* Block Reasons Breakdown */}
        {stats && Object.keys(stats.blockReasons).length > 0 && (
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 mb-6">
            <h2 className="text-xl font-semibold mb-3">Lý do chặn (ViewTwo)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(stats.blockReasons).map(([reason, count]) => (
                <div key={reason} className="bg-slate-800 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">
                    {blockReasonLabels[reason] || reason}
                  </div>
                  <div className="text-lg font-bold text-red-400">{count}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top IPs */}
        {stats && stats.topIPs.length > 0 && (
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 mb-6">
            <h2 className="text-xl font-semibold mb-3">Top 10 IP truy cập nhiều nhất</h2>
            <div className="space-y-2">
              {stats.topIPs.map((item, index) => (
                <div key={item.ip} className="flex justify-between items-center bg-slate-800 rounded p-2">
                  <span className="text-sm">
                    {index + 1}. {item.ip}
                  </span>
                  <span className="text-sm font-semibold">{item.count} lần</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 mb-6">
          <h2 className="text-xl font-semibold mb-4">Bộ lọc</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">IP Address</label>
              <input
                type="text"
                value={filters.ip}
                onChange={(e) => handleFilterChange('ip', e.target.value)}
                placeholder="Tìm theo IP..."
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">View</label>
              <select
                value={filters.view}
                onChange={(e) => handleFilterChange('view', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
              >
                <option value="">Tất cả</option>
                <option value="ViewOne">ViewOne</option>
                <option value="ViewTwo">ViewTwo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Lý do chặn</label>
              <select
                value={filters.block_reason}
                onChange={(e) => handleFilterChange('block_reason', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
              >
                <option value="">Tất cả</option>
                {Object.keys(blockReasonLabels).map((reason) => (
                  <option key={reason} value={reason}>
                    {blockReasonLabels[reason]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Danh sách logs ({total} bản ghi)</h2>
            <button
              onClick={() => {
                fetchLogs();
                fetchStats();
              }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded text-sm font-medium transition"
            >
              Làm mới
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">Đang tải...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Không có dữ liệu</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">IP</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">View</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Lý do chặn</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Organization</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">ASN</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Thời gian</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">User Agent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/50">
                        <td className="px-4 py-3 text-sm">{log.id}</td>
                        <td className="px-4 py-3 text-sm font-mono">{log.ip}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              log.view === 'ViewOne'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {log.view}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {log.block_reason ? (
                            <span className="text-red-400">
                              {blockReasonLabels[log.block_reason] || log.block_reason}
                            </span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {log.organization || <span className="text-slate-500">-</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {log.asn || <span className="text-slate-500">-</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-400">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">
                          {log.user_agent || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-slate-800 flex justify-between items-center">
                  <div className="text-sm text-slate-400">
                    Trang {page} / {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
