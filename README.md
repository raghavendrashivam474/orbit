# 🌍 Orbit

> **A modern workspace-oriented browser built for focus, context, and intentional browsing.**

Orbit is an experimental desktop application that reimagines the traditional browser as a **workspace platform** rather than simply a collection of tabs.

Instead of organizing browsing around windows and bookmarks, Orbit organizes work around **workspaces, sessions, context, and workflows**, helping users preserve the intent behind what they do on the web.

---

# 🚀 Current Status

**Current Version:** **v0.5.1**

**Development Stage:** Active

Orbit has completed its first five engineering sprints and a major post-sprint architectural refactor.

Current capabilities include:

- Modern desktop shell
- Functional browser core
- Native persistence layer
- Workspace Engine
- Per-workspace tab isolation
- Per-tab WebView lifecycle
- Session persistence
- History and bookmarks
- Event-driven architecture
- Imperative native resource orchestration
- Layered Rust + TypeScript architecture
- Architecture Decision Records (ADRs)

Sprint 5 concluded with a significant architectural refactor that simplified browser lifecycle management and established the engineering principles that will guide future native integrations.

Orbit is now entering its next phase:

> **Sprint 6 — Intelligence Foundation**

---

# Vision

Modern browsers are excellent at rendering web pages.

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

# Engineering Philosophy

Orbit is guided by several long-term engineering principles.

## Workspaces over Windows

Work is organized around contexts, not browser windows.

---

## Context over Tabs

Tabs are temporary.

Context is durable.

Orbit preserves the user's working context rather than expecting them to rebuild it every day.

---

## Architecture Before Features

Major capabilities are built on stable architectural foundations.

Each sprint strengthens the platform before expanding functionality.

---

## Separation of Responsibilities

Each subsystem owns exactly one responsibility.

- Shell owns presentation.
- Workspace owns organization.
- Browser owns navigation.
- WebviewSync owns native WebView lifecycle.
- Persistence owns storage.

---

## Imperative Ownership of Native Resources

Native resources such as WebViews are managed explicitly.

Orbit avoids reactive orchestration for native operations and instead performs deterministic synchronization through dedicated lifecycle managers.

---

## One Source of Truth

Every domain has one authoritative owner.

Derived layers synchronize from that owner rather than maintaining parallel state.

---

## Local-First

User data remains local whenever practical.

Cloud synchronization is considered an optional future capability.

---

## Performance First

Orbit is designed to remain lightweight, responsive and maintainable through careful architectural decisions rather than aggressive optimization.

---

## Privacy by Design

Future intelligence capabilities are planned with local execution as the preferred model.

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

- Browser architecture
- Renderer abstraction
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
- Workspace CRUD
- Workspace sidebar
- Workspace switching
- Per-workspace tab isolation
- Per-tab WebView lifecycle
- Active workspace persistence
- Emoji & color customization
- ADR-0007
- ADR-0008

---

## ✅ Sprint 5.1 — Architectural Refactor

- WebviewSync lifecycle manager
- Imperative WebView orchestration
- Removal of reactive render loops
- Stable workspace switching
- Stable tab restoration
- Deterministic native synchronization
- Performance improvements
- Architectural principles for future native integrations

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
└── Native WebViews
│
▼
Persistence Layer
│
├── TypeScript Repositories
├── Rust Persistence Service
├── Rust Repositories
└── SQLite (sqlx)
```

Every layer owns one responsibility.

Native resources are synchronized explicitly rather than reactively.

---

# Roadmap

## ✅ Milestone 1 — Browser Foundation

Completed.

- Browser shell
- Navigation
- Persistence
- Workspace Engine
- Stable WebView lifecycle

---

## 🟨 Milestone 2 — Intelligence Foundation

- Workspace-aware history
- Workspace-aware bookmarks
- Local AI memory
- Semantic search
- Intelligent command palette
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
- Cross-application workflows
- Workspace synchronization

---

## 🟥 Milestone 5 — Orbit Ecosystem

- Plugin SDK
- Themes
- Marketplace
- Cross-device experiences

---

## 🌍 Milestone 6 — Cross-Platform Expansion _(Long-Term)_

### macOS

- Native `.app`
- WKWebView renderer
- Native menu bar
- Apple Silicon optimization
- Code signing & notarization

### Linux

- WebKitGTK renderer
- AppImage
- Flatpak
- Snap
- Wayland & X11 compatibility

### Shared Goals

- Platform abstraction layer
- Unified renderer architecture
- Cross-platform shortcuts
- Native platform integration
- Cross-platform CI/CD

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

Orbit follows:

- Strict TypeScript
- Layered architecture
- Domain-driven design
- Rust-first persistence
- Architecture Decision Records
- Event-driven communication
- Imperative native resource management
- Structured logging
- Database migrations
- Automated linting
- Git hooks
- Incremental sprint-based development

---

# Contributing

Orbit is currently under active architectural development.

Contribution guidelines will be published before the first public beta.

---

# License

MIT License

---

# Acknowledgements

Orbit is part of a broader exploration into productivity-focused desktop software and modern application architecture.

Every sprint answers a single architectural question:

- Sprint 1 — Can Orbit exist?
- Sprint 2 — Can Orbit feel like Orbit?
- Sprint 3 — Can Orbit browse?
- Sprint 4 — Can Orbit remember?
- Sprint 5 — Can Orbit organize?

Sprint 5.1 answered a different question:

> **Can Orbit remain stable under real-world usage?**

The next chapter begins with Sprint 6:

> **Can Orbit understand?**
