#!/bin/bash
set -e

GATEWAY_LOG="${OCD_GATEWAY_LOG:-/data/openclaw-gateway.log}"

# Start OpenClaw Gateway in background if installed
if command -v openclaw &>/dev/null; then
    # Resolve config path (same logic as Go code)
    OPENCLAW_STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/openclaw"
    OPENCLAW_CONFIG="$OPENCLAW_STATE_DIR/openclaw.json"

    if [ -f "$OPENCLAW_CONFIG" ]; then
        echo "[docker-entrypoint] OpenClaw detected, starting gateway..."
        nohup openclaw gateway run --port 18789 > "$GATEWAY_LOG" 2>&1 &
        GATEWAY_PID=$!
        # Wait briefly for gateway to be ready
        GATEWAY_STARTED=false
        for i in $(seq 1 10); do
            if curl -sf http://127.0.0.1:18789/health &>/dev/null; then
                echo "[docker-entrypoint] OpenClaw gateway started successfully (pid=$GATEWAY_PID)"
                GATEWAY_STARTED=true
                break
            fi
            sleep 1
        done
        if [ "$GATEWAY_STARTED" = false ]; then
            echo "[docker-entrypoint] WARNING: OpenClaw gateway failed to start within 10s" >&2
            echo "[docker-entrypoint] Check logs: $GATEWAY_LOG" >&2
            # Print last few lines of gateway log for debugging
            tail -5 "$GATEWAY_LOG" 2>/dev/null >&2 || true
        fi
    else
        echo "[docker-entrypoint] OpenClaw installed but not configured, skipping gateway auto-start"
    fi
else
    echo "[docker-entrypoint] OpenClaw not installed, skipping gateway auto-start"
fi

# Start ClawDeckX (exec replaces shell so tini can manage signals)
exec /app/clawdeckx serve "$@"
