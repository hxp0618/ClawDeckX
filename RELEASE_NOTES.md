## What's Changed

### ✨ New Features / 新功能

- add doctor health checks, snapshot import, and API extensions
- add model vision capability config, drag-drop images, usage panel improvements
- auto-select first session on initial load when default has no messages
- add model, stopReason and rich metadata badges to chat messages
- show per-message token/cost badges and improve empty tool output display
- beautify chat sidebar with chart visuals and fix streaming status stuck
- per-session usage cards with chart-based KPI dashboard visuals
- enrich activity monitor with aggregate usage data from sessions.usage API
- enrich usage panel with full session data from sessions.usage API
- replace model override text input with dropdown from config
- Add ToolsCatalog component and market locale files, update skill locales

### 🐛 Bug Fixes / 修复

- add image input capability to default model config in wizard and installer
- fix image sending protocol and preserve images across history reloads
- send raw base64 in attachments and preserve images across history reloads
- resolve duplicate messages and stuck streaming via improved dedup and reconciliation
- raise body size limit to 20 MB and fix image attachment base64 prefix
- add tooltip to CustomSelect for truncated option labels
- robust 3-layer uninstall with force-remove fallback and Windows npm fix
- fall back to npm uninstall when openclaw CLI is broken
- enforce Node >= 22.16 in installer and update Dockerfile to node:22-alpine
- add Node 22.x minor version check in environment scanner
- detect Node version too old and show clear upgrade prompt
- add timeout to model/channel connection test requests
- smart npm mirror fallback retry and accurate speed test
- add config.apply retry with baseHash and improve error handling

### ⚡ Performance / 性能优化

- prioritize chat history loading over sessions list refresh

### 🎨 UI & Styling / 界面优化

- remove duplicate model name from top bar and show time in duration
- merge session stats into context row in usage sidebar
- fix gateway log area layout and tab text wrapping
- add sci-tech theme and modernize all window components

### 🌐 Internationalization / 国际化

- add usage panel keys for tools, duration, models across all 13 locales
- fill missing locale keys across all 13 locales (1784 keys)

### ♻️ Refactoring / 重构

- clean up gateway WebSocket client debug code
- move session info to right sidebar panel for better space usage

### 📦 Build & Deploy / 构建部署

- add CI workflow, i18n checker, and clean up unused files
- pin Node base image to 22.16-alpine

### 📝 Documentation / 文档

- update pull request template

### 🔧 Maintenance / 维护

- bump openclawCompat to >=2026.3.12

---
**Full Changelog**: [v0.0.15...v0.0.16](https://github.com/ClawDeckX/ClawDeckX/compare/v0.0.15...v0.0.16)


