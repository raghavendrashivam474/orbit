# 🌍 Orbit

> **A context-first native workspace browser designed to preserve, organize, and eventually understand digital work.**

Orbit is a native desktop browser that reimagines browsing around **workspaces, context, and continuity** rather than windows and isolated tabs.

Traditional browsers remember pages.

Orbit is designed to remember **work**.

Instead of organizing browsing around temporary tabs, Orbit organizes digital work around persistent workspaces, active context, sessions, and long-term knowledge.

Its long-term vision is to become an intelligent workspace companion that understands projects while keeping users in complete control of their data.

---

# 🚀 Current Status

**Version:** **v0.5.4z**

**Stage:** Browser Foundation Complete

Orbit has successfully completed its first major engineering milestone.

The browser now provides:

- Native desktop shell
- Stable browser engine
- Workspace-oriented browsing
- Per-workspace tab isolation
- Persistent workspace snapshots
- Active tab restoration
- Persistent tab ordering
- Persistent sessions
- History
- Bookmarks
- SQLite persistence
- Navigation Observer architecture
- Deterministic WebView synchronization
- Layered Rust + TypeScript architecture
- Architecture Decision Records (ADRs)
- Workspace context restoration
- Production-level browser stabilization

The Browser Foundation is now considered **feature complete and architecturally stable**.

Future development now shifts from browser infrastructure toward browser intelligence.

---

# 🌟 Vision

Modern browsers answer one question:

> **"Which page should I open?"**

Orbit explores a different question:

> **"Can a browser understand what I'm working on?"**

The long-term goal is to organize digital work around:

- Workspaces
- Projects
- Sessions
- Context
- Research
- Knowledge
- Collections
- Intent

rather than disconnected browser tabs.

---

# 🧭 Product Philosophy

Orbit is built around several long-term principles.

## 🏠 Workspaces over Windows

Windows are temporary.

Workspaces represent real projects and long-term contexts.

---

## 🧠 Context over Tabs

Tabs are disposable.

Context is what users actually want to preserve.

Orbit restores not only pages, but the complete working state behind those pages.

---

## 🏗 Architecture Before Features

Every architectural layer is completed before introducing dependent capabilities.

Long-term scalability always takes priority over short-term feature velocity.

---

## ⚙ Deterministic Native Resource Management

Native WebViews are synchronized explicitly through dedicated lifecycle managers.

Rendering is never left to implicit UI state.

---

## 🎯 One Source of Truth

Every domain has one authoritative owner.

Synchronization always flows outward from the source of truth.

Never sideways.

---

## 💾 Local First

User information remains local by default.

Cloud synchronization is an optional future capability.

---

## 🔒 Privacy by Design

Future intelligence capabilities are designed around local execution whenever practical.

Users should never lose ownership of their information.

---

## ⚡ Performance First

Orbit favors predictable architecture over unnecessary abstraction.

Every feature should preserve responsiveness and deterministic behavior.

---

## 🧩 Progressive Intelligence

Orbit should become smarter gradually.

Understanding should emerge naturally from user context rather than intrusive automation.

---

# 🏛 Engineering Principles

Orbit follows:

- Layered Architecture
- Domain-Driven Design
- Strict TypeScript
- Rust-first persistence
- Observer-driven synchronization
- Explicit native lifecycle management
- Incremental architectural evolution
- Architecture Decision Records (ADRs)
- Investigation before implementation
- Minimal fixes over broad rewrites
- Structured logging
- Database migrations
- Automated linting & formatting
- Git hooks
- Sprint-based incremental development

---

# 🛠 Technology Stack

| Layer             | Technology    |
| ----------------- | ------------- |
| Desktop Framework | Tauri v2      |
| Backend           | Rust          |
| Database          | SQLite + sqlx |
| Frontend          | React 19      |
| Language          | TypeScript    |
| Build Tool        | Vite          |
| Styling           | Tailwind CSS  |
| State Management  | Zustand       |
| Routing           | React Router  |
| Package Manager   | pnpm          |

---

# 🗺 Development Timeline

## ✅ Sprint 1 — Foundation

- Project bootstrap
- React + TypeScript
- Rust backend
- IPC bridge
- Zustand
- Tailwind CSS
- Development tooling
- ADR-0001

---

## ✅ Sprint 2 — Orbit Shell

- Custom title bar
- Sidebar
- Toolbar
- Address bar
- Tab interface
- Theme support
- Layout architecture
- ADR-0002

---

## ✅ Sprint 3 — Browser Core

- Browser architecture
- Renderer abstraction
- Navigation
- Keyboard shortcuts
- Browser events
- Layout manager
- ADR-0003
- ADR-0004

---

## ✅ Sprint 4 — Persistence Layer

- SQLite + sqlx
- Repository architecture
- History
- Bookmarks
- Session persistence
- Settings persistence
- Database migrations
- ADR-0005
- ADR-0006

---

## ✅ Sprint 5 — Workspace Engine

- Workspace architecture
- Workspace CRUD
- Workspace switching
- Workspace sidebar
- Per-workspace tab isolation
- Active workspace persistence
- Emoji & color customization
- ADR-0007
- ADR-0008

---

## ✅ Sprint 5.1 — Architecture Refactor

- WebviewSync lifecycle manager
- Stable renderer ownership
- Imperative WebView orchestration
- Deterministic synchronization
- Simplified browser lifecycle

---

## ✅ Sprint 5.2 — Desktop UI Polish

- Sidebar refinement
- Workspace hierarchy improvements
- Enhanced desktop UX
- UI consistency improvements

---

## ✅ Sprint 5.3 — Browser Foundation Stabilization

- Root-cause investigations
- NavigationObserver architecture
- Observer-driven persistence
- History restoration
- Browser stabilization

---

## ✅ Sprint 5.4 — Workspace Context Preservation

- Workspace snapshots
- Active tab restoration
- Persistent tab ordering
- Workspace restoration on restart
- Atomic workspace replacement
- Complete Workspace Engine

---

## ✅ Sprint 5.4.x — Browser Investigation

- Duplicate HomePage removal
- First interaction bug investigation
- Browser lifecycle improvements
- Startup stabilization

---

## ✅ Sprint 5.4.y — Platform Investigation

- Keyboard shortcut investigation
- Native platform limitation analysis
- Browser command routing improvements
- Architectural documentation updates

---

## ✅ Sprint 5.4.z — Browser Stabilization

- Command Palette stabilization
- Shortcut system refinement
- Browser lifecycle verification
- Final Browser Foundation stabilization

---

# 🏗 Current Architecture

```text
Orbit Shell
│
├── Title Bar
├── Sidebar
├── Toolbar
├── Tab Bar
│
▼
Workspace Layer
│
├── WorkspaceFacade
├── Workspace Manager
├── Workspace Snapshot
└── Workspace Store
│
▼
Browser Layer
│
├── Navigation
├── WebviewSync
├── NavigationObserver
├── Browser Store
└── Native WebViews
│
▼
Context Layer
│
├── Active Context
├── Session State
├── Snapshot Restoration
└── Context Preservation
│
▼
Persistence Layer
│
├── Rust Repositories
├── TypeScript Repositories
├── Persistence Services
└── SQLite (sqlx)
```

Every layer owns exactly one responsibility.

Together they preserve user context while maintaining deterministic synchronization.

---

# 🏆 Development Roadmap

## ✅ Milestone 1 — Browser Foundation

**Status:** Complete

Includes:

- Browser Shell
- Browser Core
- Persistence Layer
- Workspace Engine
- Context Preservation
- Browser Stabilization
- Production Hardening

---

## 🟨 Milestone 2 — Intelligence Foundation _(Current Focus)_

Planned capabilities:

- Page understanding
- Workspace understanding
- Semantic search
- Workspace-aware history
- Workspace-aware bookmarks
- Intelligent Command Palette
- Local AI memory
- Workspace intelligence engine

---

## 🟩 Milestone 3 — Productivity Layer

Planned capabilities:

- Notes
- Downloads
- Split View
- Collections
- Smart organization
- Advanced search
- Workspace tools

---

## 🟪 Milestone 4 — Orbit + RaghavOS

Planned capabilities:

- Shared sessions
- Native automation
- Cross-application workflows
- Workspace synchronization
- Deep desktop integration

---

## 🟥 Milestone 5 — Orbit Ecosystem

Planned capabilities:

- Plugin SDK
- Themes
- Marketplace
- Community extensions
- Ecosystem APIs

---

## 🌍 Milestone 6 — Cross-Platform Expansion

Planned capabilities:

- macOS support
- Linux support
- Platform abstraction layer
- Native platform integrations
- Cross-platform CI/CD

---

# 📊 Current State

Orbit's Browser Foundation is complete.

The browser is considered architecturally stable and suitable for continued feature development.

Known accepted platform limitations include:

- Windows interception of certain global keyboard shortcuts
- Native child WebView title limitations
- Operating-system controlled shortcut behavior

These are documented platform constraints rather than unresolved application bugs.

Future development focuses on browser intelligence rather than browser infrastructure.

---

# 📋 Engineering Standards

Orbit maintains:

- Strict TypeScript
- Layered Architecture
- Domain-Driven Design
- Rust-first persistence
- Observer-driven synchronization
- Deterministic native resource management
- Architecture Decision Records (ADRs)
- Structured logging
- Database migrations
- Automated linting
- Automated formatting
- Git hooks
- Sprint-based incremental development
- Clean Git history
- Comprehensive technical documentation

---

# 📄 License

MIT License

---

# 🙏 Acknowledgements

Every sprint answered one architectural question.

| Sprint       | Architectural Question                             |
| ------------ | -------------------------------------------------- |
| Sprint 1     | Can Orbit exist?                                   |
| Sprint 2     | Can Orbit feel like Orbit?                         |
| Sprint 3     | Can Orbit browse?                                  |
| Sprint 4     | Can Orbit remember?                                |
| Sprint 5     | Can Orbit organize?                                |
| Sprint 5.1   | Can Orbit remain deterministic?                    |
| Sprint 5.2   | Can Orbit feel polished?                           |
| Sprint 5.3   | Can Orbit recover from architectural change?       |
| Sprint 5.4   | Can Orbit preserve context?                        |
| Sprint 5.4.x | Can Orbit respond immediately?                     |
| Sprint 5.4.y | Can Orbit work within platform constraints?        |
| Sprint 5.4.z | Can Orbit stabilize after architectural evolution? |

The next architectural chapter begins with a new question:

> **Sprint 6 — Can Orbit understand?**
