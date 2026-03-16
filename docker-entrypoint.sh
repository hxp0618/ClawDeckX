#!/bin/bash
set -e

CLAWDECKX_DATA_DIR="${OCD_DATA_DIR:-/data/clawdeckx}"
OPENCLAW_DATA_DIR="${OPENCLAW_DATA_DIR:-/data/openclaw}"
OPENCLAW_STATE_DIR="${OPENCLAW_STATE_DIR:-${OPENCLAW_HOME:-$HOME}/.openclaw}"
OPENCLAW_CONFIG="${OPENCLAW_CONFIG_PATH:-$OPENCLAW_STATE_DIR/openclaw.json}"
NPM_CONFIG_PREFIX="${NPM_CONFIG_PREFIX:-$OPENCLAW_DATA_DIR/npm}"
GATEWAY_LOG="${OCD_GATEWAY_LOG:-$OPENCLAW_DATA_DIR/logs/gateway.log}"

mkdir -p "$CLAWDECKX_DATA_DIR" "$OPENCLAW_DATA_DIR" "$OPENCLAW_STATE_DIR" "$OPENCLAW_DATA_DIR/logs" "$NPM_CONFIG_PREFIX"
export NPM_CONFIG_PREFIX
export PATH="$NPM_CONFIG_PREFIX/bin:$PATH"
export OPENCLAW_STATE_DIR
export OPENCLAW_CONFIG_PATH="$OPENCLAW_CONFIG"

# Start OpenClaw Gateway in background if installed
if command -v openclaw &>/dev/null; then
    if [ -f "$OPENCLAW_CONFIG" ]; then
        echo "[docker-entrypoint] OpenClaw detected at $(command -v openclaw)"
        echo "[docker-entrypoint] Using OpenClaw state: $OPENCLAW_STATE_DIR"
        echo "[docker-entrypoint] Using OpenClaw config: $OPENCLAW_CONFIG"
        echo "[docker-entrypoint] Starting OpenClaw gateway..."
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
        echo "[docker-entrypoint] Expected config path: $OPENCLAW_CONFIG"
    fi
else
    echo "[docker-entrypoint] OpenClaw not installed, skipping gateway auto-start"
    echo "[docker-entrypoint] Persistent npm prefix: $NPM_CONFIG_PREFIX"
fi

# Start ClawDeckX (exec replaces shell so tini can manage signals)
exec /app/clawdeckx serve "$@"
