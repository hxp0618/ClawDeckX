## What's Changed

### ✨ New Features / 新功能

- add firewall port reminder in access URL output
- show LAN and public IP in post-install access URLs
- smart auto-detect next available instance name for multi-deploy
- support multiple Docker deployments in installer scripts
- smart port detection for Docker and binary installs
- change default port from 18788 to 18800 to avoid OpenClaw range
- unified adaptive menu for coexisting Docker and binary installs

### 🐛 Bug Fixes / 修复

- standardize internal port to 18788, Docker host port to 18700
- unified rpc retry for gateway transient disconnects
- retry hash refresh after gateway reload to prevent stale hash
- update Dockerfile.prebuilt port from 18788 to 18800
- show correct host port in container banner via OCD_HOST_PORT
- comprehensive audit fixes for reliability and compatibility
- auto-add openclaw user to docker group for cross-account access

### 🎨 UI & Styling / 界面优化

- replace technical Binary/������ labels with ClawDeckX

### 📝 Documentation / 文档

- update README to reflect unified installer for Docker

---
**Full Changelog**: [v0.0.23...v0.0.24](https://github.com/ClawDeckX/ClawDeckX/compare/v0.0.23...v0.0.24)


