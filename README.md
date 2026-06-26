# 🌍 Orbit

> **A modern workspace-oriented browser built for focus, context, and intentional browsing.**

Orbit is an experimental desktop application that reimagines the traditional browser as a **workspace platform** rather than simply a collection of tabs.

Instead of organizing browsing around windows and bookmarks, Orbit organizes work around **workspaces, sessions, context, and workflows**, helping users preserve the intent behind what they do on the web.

---

# 🚀 Current Status

**Current Version:** **v0.5.0**

**Development Stage:** Active

Orbit has completed its first **five engineering sprints** and now includes:

- Modern desktop shell
- Functional browser core
- Native persistence layer
- Workspace Engine
- Per-workspace tab isolation
- Session persistence
- History and bookmarks
- Event-driven architecture
- Layered Rust + TypeScript architecture
- Architecture Decision Records (ADRs)

The browser foundation is complete.

Orbit is now entering its next phase: **Intelligence Foundation**.

---

# Vision

Modern browsers are excellent at rendering web pages.

Orbit explores a different question:

> **What if a browser understood why you opened a page, not just what page you opened?**

Orbit is designed to become a workspace where users organize their digital work around:

- Workspaces
- Projects
- Sessions
- Research
- Collections
- Context
- Workflows

rather than accumulating hundreds of disconnected tabs.

---

# Engineering Philosophy

Orbit is guided by several long-term engineering principles.

## Workspaces over Windows

People work in contexts—not browser windows.

Orbit makes the workspace the primary organizing unit of the application.

---

## Context over Tabs

Tabs are temporary.

Context is valuable.

Orbit preserves the user's working context instead of expecting them to rebuild it every day.

---

## Architecture Before Features

Major capabilities are built on stable architectural foundations.

Every sprint strengthens the platform before expanding it.

---

## Separation of Concerns

Each subsystem owns a single responsibility.

- Shell owns presentation.
- Workspace owns organization.
- Browser owns navigation.
- Renderer owns rendering.
- Persistence owns storage.

---

## Local-First

User data belongs to the user.

Orbit stores information locally whenever practical and treats cloud synchronization as an optional future capability.

---

## Performance First

Orbit is built using lightweight native technologies to deliver responsive desktop performance with efficient resource usage.

---

## Privacy by Design

Future intelligence features are planned with local execution as the default wherever practical.

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

# Development Progress

## ✅ Sprint 1 — Foundation

- Tauri v2
- React + TypeScript
- Rust backend
- IPC bridge
- Zustand
- Tailwind CSS
- Tooling
- ADR-0001

---

## ✅ Sprint 2 — Orbit Shell

- Custom title bar
- Sidebar
- Toolbar
- Address bar
- Tab interface
- Theme support
- Layout system
- ADR-0002

---

## ✅ Sprint 3 — Browser Core

- BrowserFacade
- Renderer abstraction
- WebView2 renderer
- Navigation
- Tabs
- Keyboard shortcuts
- Browser event system
- Layout manager
- ADR-0003
- ADR-0004

---

## ✅ Sprint 4 — Persistence Layer

- SQLite + sqlx
- Repository architecture
- PersistenceService
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
- WorkspaceFacade
- Workspace CRUD
- Default Personal workspace
- Workspace sidebar
- Workspace switching
- Per-workspace tab isolation
- Per-tab renderer lifecycle
- Active workspace persistence
- Emoji & color customization
- ADR-0007
- ADR-0008

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
├── BrowserFacade
├── Renderer Interface
└── WebView2 Renderer
│
▼
Layout System
│
├── Layout Manager
└── Content Bounds
│
▼
Persistence Layer
│
├── TypeScript Repositories
├── Rust Persistence Service
├── Rust Repositories
└── SQLite (sqlx)
```

Every layer owns one responsibility and communicates through well-defined interfaces.

---

# Roadmap

## ✅ Milestone 1 — Browser Foundation

Completed.

- Browser shell
- Navigation
- Browser core
- Persistence
- Workspace Engine

---

## 🟨 Milestone 2 — Intelligence Foundation

- Workspace-aware history
- Workspace-aware bookmarks
- Local AI memory
- Semantic search
- Content extraction
- Intelligent command palette

---

## 🟩 Milestone 3 — Productivity Layer

- Notes
- Downloads
- Split view
- Collections
- Smart organization
- Advanced search

---

## 🟪 Milestone 4 — Orbit + RaghavOS

- Shared sessions
- Resource integration
- Native automation
- Cross-application workflows
- Workspace synchronization

---

## 🟥 Milestone 5 — Orbit Ecosystem

- Plugin SDK
- Themes
- Marketplace
- Cross-device experiences

---

# Repository Structure

```text
src/
    React frontend

src-tauri/
    Rust backend

docs/
    Architecture
    ADRs
    Sprint Reports
    Engineering Notes

assets/
    Application assets
```

---

# Engineering Standards

Orbit is developed with a strong emphasis on long-term maintainability.

The project follows:

- Strict TypeScript
- Layered architecture
- Domain-driven design
- Rust-first persistence
- Architecture Decision Records (ADRs)
- Event-driven communication
- Structured logging
- Database migrations
- Automated linting and formatting
- Git hooks
- Incremental sprint-based development

---

# Contributing

Orbit is currently under active architectural development.

Contribution guidelines will be published once the project reaches its first public beta.

---

# License

MIT License

---

# Acknowledgements

Orbit is part of a broader exploration into productivity-focused desktop software and modern application architecture.

Each sprint answers one architectural question:

- Sprint 1 — Can Orbit exist?
- Sprint 2 — Can Orbit feel like Orbit?
- Sprint 3 — Can Orbit browse?
- Sprint 4 — Can Orbit remember?
- Sprint 5 — Can Orbit organize?

The next chapter begins with Sprint 6:

> **Can Orbit understand?**
