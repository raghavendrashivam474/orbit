# 🌍 Orbit

> **A context-first workspace browser built to preserve, organize, and eventually understand digital work.**

Orbit is a native desktop application that reimagines the traditional browser as a **workspace and context platform** rather than simply a collection of tabs.

Instead of organizing browsing around windows and bookmarks, Orbit organizes work around **workspaces, sessions, context, and workflows**, preserving not only what users open, but also where they left off.

---

# 🚀 Current Status

**Version:** **v0.5.4**

**Stage:** Active Development

Orbit has completed its **Browser Foundation** and **Workspace Engine**.

With Sprint 5.4, Orbit now preserves complete workspace context across workspace switches and application restarts, making workspaces true persistent working environments rather than temporary collections of tabs.

Current capabilities include:

- Native desktop shell
- Workspace-oriented browsing
- Per-workspace tab isolation
- Workspace snapshot restoration
- Active tab restoration
- Persistent tab ordering
- Stable WebView lifecycle
- Persistent sessions
- History & bookmarks
- SQLite persistence
- Rust backend
- Navigation Observer architecture
- Layered Rust + TypeScript architecture
- Architecture Decision Records (ADRs)

The Browser Foundation and Workspace Engine are now considered complete.

Orbit now enters its next architectural chapter:

> **Sprint 6 — Intelligence Foundation**

---

# Vision

Modern browsers excel at rendering pages.

Orbit explores a different question:

> **What if a browser remembered not only what you opened—but also the state of your work?**

The long-term goal is to organize digital work around:

- Workspaces
- Projects
- Sessions
- Context
- Research
- Collections
- Knowledge

rather than disconnected browser tabs.

---

# Core Engineering Principles

## 🏠 Workspaces over Windows

Contexts—not windows—are the primary unit of organization.

---

## 🧠 Context over Tabs

Tabs are temporary.

Context is durable.

Orbit preserves the user's working state so work resumes exactly where it stopped.

---

## 🏗 Architecture Before Features

Every sprint strengthens the platform before introducing new capabilities.

Long-term maintainability always comes first.

---

## 🎯 Single Responsibility

Every subsystem owns one responsibility.

- Shell → Presentation
- Workspace → Organization
- Browser → Navigation
- Context → Preservation
- Persistence → Storage
- Intelligence → Understanding (future)

---

## ⚡ Deterministic Native Resource Management

Native resources such as WebViews are synchronized explicitly through dedicated lifecycle managers rather than reactive rendering.

---

## 📍 One Source of Truth

Every domain has exactly one owner.

Derived layers synchronize from authoritative state instead of duplicating it.

---

## 💾 Local-First

User information remains local whenever practical.

Cloud synchronization is an optional future capability.

---

## 🚀 Performance First

Orbit favors simple, deterministic architecture over unnecessary complexity.

---

## 🔒 Privacy by Design

Future intelligence features are designed around local execution whenever practical.

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
- Improved workspace hierarchy
- Enhanced transitions
- Desktop UX improvements

---

## ✅ Sprint 5.3 — Browser Foundation Stabilization

- Root-cause investigation
- NavigationObserver
- Observer-driven persistence
- History restoration
- Browser stabilization

---

## ✅ Sprint 5.4 — Workspace Context Preservation

- Workspace snapshots
- Active tab restoration
- Persistent tab ordering
- Context restoration on restart
- Atomic workspace tab replacement
- Complete Workspace Engine

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
├── Workspace Snapshot
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
Context Layer
│
├── Snapshot Restoration
├── Active Context
└── Workspace Preservation
│
▼
Persistence Layer
│
├── TypeScript Repositories
├── Rust Repositories
├── Persistence Services
└── SQLite (sqlx)
```

Every layer owns exactly one responsibility.

Together they preserve user context.

---

# Roadmap

## ✅ Milestone 1 — Browser Foundation

Completed.

- Browser shell
- Browser core
- Persistence
- Workspace Engine
- Context preservation
- Browser stabilization

---

## 🟨 Milestone 2 — Intelligence Foundation

- Page understanding
- Workspace knowledge
- Semantic search
- Workspace-aware history
- Workspace-aware bookmarks
- Intelligent Command Palette
- Local AI memory

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

- macOS
- Linux
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
- Automated linting & formatting
- Git hooks
- Sprint-based incremental development

---

# License

MIT License

---

# Acknowledgements

Every sprint answers one architectural question.

- **Sprint 1** — Can Orbit exist?
- **Sprint 2** — Can Orbit feel like Orbit?
- **Sprint 3** — Can Orbit browse?
- **Sprint 4** — Can Orbit remember?
- **Sprint 5** — Can Orbit organize?
- **Sprint 5.1** — Can Orbit remain stable?
- **Sprint 5.2** — Can Orbit feel polished?
- **Sprint 5.3** — Can Orbit recover gracefully from architectural change?
- **Sprint 5.4** — Can Orbit preserve context?

The next architectural chapter begins with:

> **Sprint 6 — Can Orbit understand?**
