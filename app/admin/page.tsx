'use client';

import React, { useEffect, useState } from 'react';

const ADMIN_API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY ?? '';

function adminHeaders(): Record<string, string> {
  const h: Record<string, string> = {};
  if (ADMIN_API_KEY) h['x-admin-key'] = ADMIN_API_KEY;
  return h;
}

interface ParsedUserAgent {
  browser?: { name?: string; version?: string };
  device?: { model?: string; type?: string; vendor?: string };
  engine?: { name?: string; version?: string };
  os?: { name?: string; version?: string };
  cpu?: { architecture?: string };
  isBot?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
}

interface AccessLog {
  id: number;
  ip: string;
  view: 'ViewOne' | 'ViewTwo';
  block_reason: string | null;
  organization: string | null;
  asn: number | null;
  timestamp: string;
  user_agent: string | null;
  user_agent_parsed: string | null;
  headers: string | null;
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
  const [expandedHeaders, setExpandedHeaders] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    ip: '',
    view: '' as '' | 'ViewOne' | 'ViewTwo',
    block_reason: '',
  });
  const [enableAdClickCheck, setEnableAdClickCheck] = useState<boolean>(false);
  const [loadingSetting, setLoadingSetting] = useState(true);

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

      const response = await fetch(`/api/admin/logs?${params.toString()}`, { headers: adminHeaders() });
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
      const response = await fetch('/api/admin/stats', { headers: adminHeaders() });
      const data: Statistics = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSetting = async () => {
    try {
      setLoadingSetting(true);
      const response = await fetch('/api/admin/settings?key=enableAdClickCheck', { headers: adminHeaders() });
      const data = await response.json();
      setEnableAdClickCheck(data.value === 'true');
    } catch (error) {
      console.error('Error fetching setting:', error);
    } finally {
      setLoadingSetting(false);
    }
  };

  const updateSetting = async (value: boolean) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...adminHeaders(),
        },
        body: JSON.stringify({
          key: 'enableAdClickCheck',
          value: value.toString(),
        }),
      });
      
      if (response.ok) {
        setEnableAdClickCheck(value);
      } else {
        console.error('Error updating setting');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchStats();
    fetchSetting();
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
    BOT_DETECTED: 'Phát hiện Bot (Googlebot, Bingbot, etc.)',
    BLOCKED_USER_AGENT: 'User-agent bị chặn (Editor/Tool)',
    NOT_AD_CLICK: 'Không phải click từ quảng cáo',
    ERROR: 'Lỗi xử lý',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin - Thống kê IP truy cập</h1>

        {/* Settings Toggle */}
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">Kiểm tra Click Quảng Cáo (Bước 0)</h2>
              <p className="text-sm text-slate-400">
                {enableAdClickCheck 
                  ? 'Đang bật: Chỉ hiển thị ViewOne cho click từ quảng cáo' 
                  : 'Đang tắt: Bỏ qua bước kiểm tra click quảng cáo'}
              </p>
            </div>
            <button
              onClick={() => updateSetting(!enableAdClickCheck)}
              disabled={loadingSetting}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enableAdClickCheck ? 'bg-emerald-500' : 'bg-slate-600'
              } ${loadingSetting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enableAdClickCheck ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

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
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Headers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {logs.map((log) => {
                      let parsedHeaders: Record<string, string> | null = null;
                      try {
                        parsedHeaders = log.headers ? JSON.parse(log.headers) : null;
                      } catch (e) {
                        // Invalid JSON
                      }
                      
                      let parsedUA: ParsedUserAgent | null = null;
                      try {
                        parsedUA = log.user_agent_parsed ? JSON.parse(log.user_agent_parsed) : null;
                      } catch (e) {
                        // Invalid JSON
                      }
                      
                      const isExpanded = expandedHeaders === log.id;
                      
                      // Format parsed UA để hiển thị
                      const formatUA = () => {
                        if (!parsedUA) return log.user_agent || '-';
                        const parts: string[] = [];
                        if (parsedUA.browser?.name) {
                          parts.push(`${parsedUA.browser.name}${parsedUA.browser.version ? ` ${parsedUA.browser.version}` : ''}`);
                        }
                        if (parsedUA.os?.name) {
                          parts.push(`(${parsedUA.os.name}${parsedUA.os.version ? ` ${parsedUA.os.version}` : ''})`);
                        }
                        if (parsedUA.device?.type) {
                          parts.push(`[${parsedUA.device.type}]`);
                        }
                        if (parsedUA.isBot) {
                          parts.push('🤖 BOT');
                        }
                        return parts.length > 0 ? parts.join(' ') : log.user_agent || '-';
                      };
                      
                      return (
                        <React.Fragment key={log.id}>
                          <tr className="hover:bg-slate-800/50">
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
                            <td className="px-4 py-3 text-xs max-w-xs">
                              <div className="space-y-1">
                                <div className={`${parsedUA?.isBot ? 'text-red-400' : parsedUA?.isMobile ? 'text-blue-400' : 'text-slate-300'}`}>
                                  {formatUA()}
                                </div>
                                {parsedUA && (
                                  <div className="text-[10px] text-slate-500 space-y-0.5">
                                    {parsedUA.device?.vendor && (
                                      <div>Device: {parsedUA.device.vendor} {parsedUA.device.model || ''}</div>
                                    )}
                                    {parsedUA.engine?.name && (
                                      <div>Engine: {parsedUA.engine.name} {parsedUA.engine.version || ''}</div>
                                    )}
                                    {parsedUA.cpu?.architecture && (
                                      <div>CPU: {parsedUA.cpu.architecture}</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {parsedHeaders ? (
                                <button
                                  onClick={() => setExpandedHeaders(isExpanded ? null : log.id)}
                                  className="text-sky-400 hover:text-sky-300 underline"
                                >
                                  {isExpanded ? 'Ẩn' : 'Xem'}
                                </button>
                              ) : (
                                <span className="text-slate-500">-</span>
                              )}
                            </td>
                          </tr>
                          {isExpanded && parsedHeaders && (
                            <tr>
                              <td colSpan={9} className="px-4 py-3 bg-slate-800/30">
                                <div className="space-y-2">
                                  <div className="text-xs font-semibold text-slate-400 mb-2">Headers:</div>
                                  <pre className="text-xs text-slate-300 bg-slate-900 p-3 rounded overflow-x-auto">
                                    {JSON.stringify(parsedHeaders, null, 2)}
                                  </pre>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
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
