import React, { useState, useEffect, useCallback } from 'react';
import { MiniDonut, MiniBarChart } from './MiniChart';

interface UsagePanelProps {
  sessionKey: string;
  gwReady: boolean;
  loadUsage: (key: string) => Promise<any>;
  labels: Record<string, string>;
}

const fmtTok = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n || 0);
const fmtCost = (n: number) => n >= 1 ? `$${n.toFixed(2)}` : n > 0 ? `$${n.toFixed(4)}` : '$0';

export const UsagePanel: React.FC<UsagePanelProps> = ({ sessionKey, gwReady, loadUsage, labels: a }) => {
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('usage-panel-collapsed') === '1'; } catch { return false; }
  });

  const load = useCallback(async () => {
    if (!gwReady || !sessionKey) return;
    setLoading(true);
    setError(null);
    try {
      const data = await loadUsage(sessionKey);
      setUsage(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    }
    setLoading(false);
  }, [gwReady, sessionKey, loadUsage]);

  useEffect(() => { load(); }, [load]);

  const toggle = () => {
    setCollapsed(v => {
      try { localStorage.setItem('usage-panel-collapsed', v ? '0' : '1'); } catch {}
      return !v;
    });
  };

  if (collapsed) {
    return (
      <button onClick={toggle}
        className="w-8 h-full border-s border-slate-200/60 dark:border-white/[0.06] flex items-center justify-center
                   bg-white/50 dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.04] transition">
        <span className="material-symbols-outlined text-[14px] text-slate-400">analytics</span>
      </button>
    );
  }

  const u = usage;
  const tokenSlices = u ? [
    { value: u.input || 0, color: '#3b82f6' },
    { value: u.output || 0, color: '#f59e0b' },
    ...(u.cacheRead ? [{ value: u.cacheRead, color: '#8b5cf6' }] : []),
  ].filter(d => d.value > 0) : [];

  const dailyData = u?.dailyBreakdown?.slice(-7) || [];

  return (
    <div className="w-56 shrink-0 border-s border-slate-200/60 dark:border-white/[0.06]
                    bg-white/50 dark:bg-white/[0.02] flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100/60 dark:border-white/[0.04]">
        <span className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase">{a.usage || 'Usage'}</span>
        <div className="flex items-center gap-1">
          <button onClick={load} disabled={loading} className="p-0.5 text-slate-400 hover:text-primary">
            <span className={`material-symbols-outlined text-[12px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
          </button>
          <button onClick={toggle} className="p-0.5 text-slate-400 hover:text-primary">
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <span className="material-symbols-outlined text-[20px] text-red-400">error</span>
          <p className="text-[10px] text-red-400">{error}</p>
          <button onClick={load} className="text-[9px] px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition">
            {a.retry || 'Retry'}
          </button>
        </div>
      ) : !u ? (
        <div className="flex-1 flex items-center justify-center text-[10px] text-slate-400 dark:text-white/20">
          {loading ? (a.loading || 'Loading...') : (a.noData || 'No data')}
        </div>
      ) : (
        <div className="p-3 space-y-4">
          {/* Token Donut */}
          {tokenSlices.length > 0 && (
            <div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase mb-1">{a.tokens || 'Tokens'}</div>
              <div className="flex items-center gap-2">
                <MiniDonut size={56} slices={tokenSlices} innerRadius={0.6} />
                <div className="text-[9px] space-y-0.5">
                  <div><span className="text-blue-500">●</span> {a.input || 'In'}: {fmtTok(u.input)}</div>
                  <div><span className="text-amber-500">●</span> {a.output || 'Out'}: {fmtTok(u.output)}</div>
                  {u.cacheRead > 0 && <div><span className="text-purple-500">●</span> {a.cache || 'Cache'}: {fmtTok(u.cacheRead)}</div>}
                </div>
              </div>
            </div>
          )}

          {/* Cost */}
          <div>
            <div className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase mb-1">{a.cost || 'Cost'}</div>
            <div className="text-lg font-bold text-slate-700 dark:text-white/80 tabular-nums">{fmtCost(u.totalCost || 0)}</div>
            <div className="text-[8px] text-slate-400 dark:text-white/25">
              {a.input || 'In'}: {fmtCost(u.inputCost || 0)} · {a.output || 'Out'}: {fmtCost(u.outputCost || 0)}
            </div>
          </div>

          {/* Messages */}
          {u.messageCounts && (
            <div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase mb-1">{a.messages || 'Messages'}</div>
              <div className="grid grid-cols-2 gap-1 text-[9px]">
                <div className="text-slate-500 dark:text-white/35">{a.user || 'User'}: <b>{u.messageCounts.user}</b></div>
                <div className="text-slate-500 dark:text-white/35">{a.assistant || 'Asst'}: <b>{u.messageCounts.assistant}</b></div>
                <div className="text-slate-500 dark:text-white/35">{a.toolCall || 'Tools'}: <b>{u.messageCounts.toolCalls}</b></div>
                <div className="text-slate-500 dark:text-white/35">{a.error || 'Errors'}: <b>{u.messageCounts.errors}</b></div>
              </div>
            </div>
          )}

          {/* Latency */}
          {u.latency && u.latency.count > 0 && (
            <div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase mb-1">{a.latency || 'Latency'}</div>
              <div className="text-[9px] text-slate-500 dark:text-white/35 space-y-0.5">
                <div>Avg: <b>{(u.latency.sum / u.latency.count / 1000).toFixed(1)}s</b></div>
                <div>P95: <b>{(u.latency.p95Max / 1000).toFixed(1)}s</b></div>
              </div>
            </div>
          )}

          {/* Daily bar chart */}
          {dailyData.length > 0 && (
            <div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase mb-1">{a.trend7d || '7-Day Trend'}</div>
              <MiniBarChart values={dailyData.map((d: any) => d.tokens || 0)} height={48} color="#3b82f6" />
            </div>
          )}

          {/* Model usage */}
          {u.modelUsage?.length > 0 && (
            <div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase mb-1">{a.model || 'Models'}</div>
              {u.modelUsage.slice(0, 3).map((m: any, i: number) => (
                <div key={i} className="text-[9px] text-slate-500 dark:text-white/35 truncate">{m.model}: {m.count}x</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
