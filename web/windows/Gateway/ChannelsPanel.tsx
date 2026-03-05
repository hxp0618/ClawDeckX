import React from 'react';

export interface ChannelsPanelProps {
  gw: any;
  channelsList: any[];
  channelsLoading: boolean;
  channelLogoutLoading: string | null;
  fetchChannels: (force?: boolean) => void;
  handleChannelLogout: (channel: string) => void;
}

const ChannelsPanel: React.FC<ChannelsPanelProps> = ({
  gw, channelsList, channelsLoading, channelLogoutLoading,
  fetchChannels, handleChannelLogout,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[12px] font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary">cell_tower</span>
          {gw.channels || 'Channels'}
        </h3>
        <button onClick={() => fetchChannels(true)} disabled={channelsLoading}
          className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 text-white/60 hover:text-white disabled:opacity-40 flex items-center gap-1">
          <span className={`material-symbols-outlined text-[12px] ${channelsLoading ? 'animate-spin' : ''}`}>{channelsLoading ? 'progress_activity' : 'refresh'}</span>
          {gw.refresh}
        </button>
      </div>
      {channelsLoading && channelsList.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-white/30 text-[11px]">
          <span className="material-symbols-outlined text-[18px] animate-spin me-2">progress_activity</span>
          {gw.loading}
        </div>
      ) : channelsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-white/20">
          <span className="material-symbols-outlined text-[36px] mb-3">signal_disconnected</span>
          <p className="text-[12px]">{gw.noChannels || 'No channels configured'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {channelsList.map((ch: any) => {
            const name = ch.name || ch.channel || ch.id || 'unknown';
            const rawStatus = String(ch.status || ch.state || '').toLowerCase();
            const isConnected = ch.connected === true || rawStatus === 'connected' || rawStatus === 'open' || (ch.running === true && ch.connected !== false);
            const isDisconnected = ch.lastError || rawStatus === 'disconnected' || rawStatus === 'closed' || rawStatus === 'error' || rawStatus === 'failed';
            const isIdle = (!isConnected && !isDisconnected && ch.running === true) || rawStatus === 'idle' || rawStatus === 'waiting';
            const isDisabled = ch.enabled === false || rawStatus === 'disabled' || rawStatus === 'off';

            const statusColor = isConnected ? 'bg-emerald-500' : isDisconnected ? 'bg-red-500' : isIdle ? 'bg-amber-500' : isDisabled ? 'bg-slate-600' : 'bg-slate-500';
            const statusText = isConnected ? (gw.channelConnected || 'Connected')
              : isDisconnected ? (gw.channelDisconnected || 'Disconnected')
              : isIdle ? (gw.channelIdle || 'Idle')
              : isDisabled ? (gw.channelDisabled || 'Disabled')
              : (gw.channelUnknown || 'Unknown');
            const statusTextColor = isConnected ? 'text-emerald-400' : isDisconnected ? 'text-red-400' : isIdle ? 'text-amber-400' : 'text-white/30';

            const lastEvent = ch.lastEvent || ch.last_event || ch.lastActivity || ch.last_activity;
            const lastEventStr = lastEvent ? new Date(lastEvent).toLocaleString() : null;

            return (
              <div key={name} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-center gap-4 hover:bg-white/[0.04] transition-colors">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${statusColor} shadow-lg`} />
                  {isConnected && <div className={`absolute inset-0 w-3 h-3 rounded-full ${statusColor} animate-ping opacity-40`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-white/80 truncate">{name}</span>
                    <span className={`text-[10px] font-bold uppercase ${statusTextColor}`}>{statusText}</span>
                  </div>
                  {lastEventStr && (
                    <p className="text-[10px] text-white/30 mt-0.5">
                      {gw.channelLastEvent || 'Last Activity'}: {lastEventStr}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleChannelLogout(name)} disabled={channelLogoutLoading === name || isDisabled}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-30 transition-all flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      {channelLogoutLoading === name ? 'progress_activity' : 'logout'}
                    </span>
                    {gw.channelLogout || 'Logout'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChannelsPanel;
