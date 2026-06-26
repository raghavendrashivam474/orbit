# 🌍 Orbit

> **A modern workspace-oriented browser designed for focus, context, and intentional browsing.**

Orbit is an experimental desktop application that reimagines the traditional browser as a **workspace platform** rather than simply a collection of tabs.

Rather than organizing browsing around windows and bookmarks, Orbit organizes work around **workspaces, sessions, context, and workflows**, helping users preserve the intent behind their digital work.

---

# 🚀 Current Status

**Version:** **v0.5.3**

**Stage:** Active Development

Orbit has completed its Browser Foundation and Workspace Engine. Following real-world testing, Sprint 5.3 stabilized the browser architecture by restoring end-to-end history recording through a clean observer-based notification model.

Current capabilities include:

- Native desktop shell
- Workspace-oriented browsing
- Per-workspace tab isolation
- Stable WebView lifecycle
- Persistent sessions
- History & bookmarks
- SQLite persistence
- Rust backend
- Workspace switching
- Navigation observer architecture
- Layered TypeScript + Rust architecture
- Architecture Decision Records (ADRs)

The Browser Foundation is now considered stable and ready for the next phase:

> **Sprint 6 — Intelligence Foundation**

---

# Vision

Modern browsers excel at rendering web pages.

Orbit explores a different question:

> **What if a browser understood why you opened a page, not just what page you opened?**

Orbit aims to organize digital work around:

- Workspaces
- Projects
- Sessions
- Research
- Collections
- Context
- Workflows

instead of accumulating disconnected tabs.

---

# Core Engineering Principles

## 🏠 Workspaces over Windows

Contexts are the primary organizational unit.

Orbit treats workspaces—not browser windows—as the foundation of browsing.

---

## 🧠 Context over Tabs

Tabs are temporary.

Context is durable.

Orbit preserves working context so users can continue meaningful work without rebuilding it.

---

## 🏗 Architecture Before Features

Every sprint strengthens the platform before expanding functionality.

Long-term maintainability always takes priority over short-term convenience.

---

## 🎯 Single Responsibility

Each subsystem owns one responsibility.

- Shell → Presentation
- Workspace → Organization
- Browser → Navigation
- WebviewSync → Native WebView lifecycle
- Persistence → Storage

---

## ⚡ Deterministic Native Resource Management

Native resources are managed explicitly.

Orbit avoids reactive orchestration for platform resources and instead performs deterministic synchronization through dedicated lifecycle managers.

---

## 📍 One Source of Truth

Every domain has one authoritative owner.

Derived layers synchronize from that source instead of maintaining duplicate state.

---

## 💾 Local-First

User data remains local whenever practical.

Cloud synchronization is treated as an optional future enhancement.

---

## 🚀 Performance First

Orbit prioritizes responsiveness, maintainability, and efficient native resource usage over unnecessary complexity.

---

## 🔒 Privacy by Design

Future intelligence capabilities are planned with local execution as the preferred model whenever practical.

---

# Technology Stack

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

# Development Timeline

## ✅ Sprint 1 — Foundation

- Project scaffold
- React + TypeScript
- Rust backend
- IPC bridge
- Zustand
- Tailwind CSS
- Tooling
- ADR-0001

---

## ✅ Sprint 2 — Orbit Shell

- Title bar
- Sidebar
- Toolbar
- Address bar
- Tabs
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
- Deterministic synchronization
- Imperative native orchestration
- Simplified browser lifecycle

---

## ✅ Sprint 5.2 — Desktop UI Polish

- Refined sidebar
- Improved workspace visuals
- Better spacing
- Enhanced transitions
- Improved desktop UX

---

## ✅ Sprint 5.3 — Browser Foundation Stabilization

- Root-cause investigation
- Restored history recording
- NavigationObserver architecture
- Observer-based persistence notifications
- Verified end-to-end persistence
- Stable restart behavior
- Browser Foundation validated

---

# Current Architecture

```text
Orbit Shell
│
├── Title Bar
├── Tab Bar
├── Toolbar
├── Sidebar
│
▼
Workspace Layer
│
├── WorkspaceFacade
├── Workspace Manager
└── Workspace State
│
▼
Browser Layer
│
├── Navigation
├── WebviewSync
├── NavigationObserver
└── Native WebViews
│
▼
Persistence Layer
│
├── TypeScript Repositories
├── PersistenceService
├── Rust Repositories
└── SQLite (sqlx)
```

Every layer owns one responsibility and communicates through explicit contracts.

---

# Roadmap

## ✅ Milestone 1 — Browser Foundation

Completed.

- Browser shell
- Browser core
- Persistence
- Workspace Engine
- Stable WebView lifecycle
- Browser stabilization

---

## 🟨 Milestone 2 — Intelligence Foundation

- Workspace-aware history
- Workspace-aware bookmarks
- Semantic search
- Intelligent command palette
- Local AI memory
- Content understanding

---

## 🟩 Milestone 3 — Productivity Layer

- Notes
- Downloads
- Split View
- Collections
- Smart organization
- Advanced search

---

## 🟪 Milestone 4 — Orbit + RaghavOS

- Shared sessions
- Resource integration
- Native automation
- Workspace synchronization
- Cross-application workflows

---

## 🟥 Milestone 5 — Orbit Ecosystem

- Plugin SDK
- Themes
- Marketplace
- Cross-device experiences

---

## 🌍 Milestone 6 — Cross-Platform Expansion

- macOS support
- Linux support
- Platform abstraction layer
- Native integrations
- Cross-platform CI/CD

---

# Engineering Standards

Orbit follows:

- Strict TypeScript
- Layered architecture
- Domain-driven design
- Rust-first persistence
- Architecture Decision Records (ADRs)
- Observer-driven domain notifications
- Imperative native resource management
- Structured logging
- Database migrations
- Automated linting
- Git hooks
- Sprint-based development

---

# License

MIT License

---

# Acknowledgements

Orbit is part of a broader exploration into productivity-focused desktop software and modern application architecture.

Each sprint answers a single architectural question:

- Sprint 1 — Can Orbit exist?
- Sprint 2 — Can Orbit feel like Orbit?
- Sprint 3 — Can Orbit browse?
- Sprint 4 — Can Orbit remember?
- Sprint 5 — Can Orbit organize?
- Sprint 5.1 — Can Orbit remain stable?
- Sprint 5.2 — Can Orbit feel polished?
- Sprint 5.3 — Can Orbit recover gracefully from architectural change?

The next chapter begins with **Sprint 6**:

> **Can Orbit understand?**
