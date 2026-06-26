# 🌍 Orbit

> **A modern workspace-oriented browser designed for focus, context, and intentional browsing.**

Orbit is a desktop application that reimagines the traditional browser as a **workspace platform** rather than simply a collection of tabs.

Instead of organizing browsing around windows and bookmarks, Orbit organizes work around **workspaces, sessions, context, and workflows**, helping users preserve the intent behind their digital work.

---

# 🚀 Current Status

**Version:** **v0.5.2**

**Stage:** Active Development

Orbit has completed its browser foundation and workspace engine. The project now provides:

- Modern native desktop shell
- Workspace-oriented browsing
- Per-workspace tab isolation
- Persistent sessions
- History & bookmarks
- SQLite persistence
- Native Rust backend
- Workspace switching
- Stable WebView lifecycle
- Refined desktop UI
- Layered architecture
- Architecture Decision Records (ADRs)

The next development phase focuses on building Orbit's **Intelligence Foundation**.

---

# Vision

Modern browsers excel at rendering web pages.

Orbit explores a different question:

> **What if a browser understood why you opened a page, not just what page you opened?**

Orbit aims to become a workspace where users organize their digital life around:

- Workspaces
- Projects
- Sessions
- Research
- Collections
- Context
- Workflows

instead of accumulating hundreds of disconnected tabs.

---

# Core Philosophy

## 🏠 Workspaces over Windows

People don't work in browser windows.

They work in contexts.

Orbit makes workspaces the primary organizational unit.

---

## 🧠 Context over Tabs

Tabs are temporary.

Context is valuable.

Orbit preserves context so users can resume meaningful work without rebuilding it.

---

## 🏗 Architecture Before Features

Every major feature is built on a stable architectural foundation.

The platform evolves incrementally through carefully planned engineering milestones.

---

## 🎯 Single Responsibility

Every subsystem owns exactly one responsibility.

- Shell owns presentation.
- Workspace owns organization.
- Browser owns navigation.
- WebviewSync owns native renderer lifecycle.
- Persistence owns storage.

---

## ⚡ Imperative Native Resource Management

Native resources such as WebViews are managed explicitly.

Orbit favors deterministic synchronization over reactive orchestration for native platform resources.

---

## 📍 One Source of Truth

Every domain has one authoritative owner.

Derived state synchronizes from that source rather than maintaining duplicated state.

---

## 💾 Local-First

User data belongs to the user.

Orbit stores information locally whenever practical.

Cloud synchronization is considered an optional future capability.

---

## 🚀 Performance First

Orbit is designed using lightweight native technologies with an emphasis on responsiveness, maintainability, and efficient resource usage.

---

## 🔒 Privacy by Design

Future intelligence capabilities are planned with local execution as the preferred model wherever practical.

---

# Technology Stack

| Layer             | Technology    |
| ----------------- | ------------- |
| Desktop Framework | Tauri v2      |
| Backend           | Rust          |
| Database          | SQLite + sqlx |
| Frontend          | React 19      |
| Language          | TypeScript    |
| Styling           | Tailwind CSS  |
| Build Tool        | Vite          |
| State Management  | Zustand       |
| Routing           | React Router  |
| Package Manager   | pnpm          |

---

# Development Timeline

## ✅ Sprint 1 — Foundation

- Tauri v2
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

- Renderer abstraction
- Browser architecture
- Navigation
- Keyboard shortcuts
- Browser events
- Layout manager
- ADR-0003
- ADR-0004

---

## ✅ Sprint 4 — Persistence Layer

- SQLite + sqlx
- PersistenceService
- Repository architecture
- History
- Bookmarks
- Session persistence
- Database migrations
- ADR-0005
- ADR-0006

---

## ✅ Sprint 5 — Workspace Engine

- Workspace architecture
- Workspace CRUD
- Workspace switching
- Workspace sidebar
- Per-workspace tabs
- Active workspace persistence
- Emoji & color customization
- ADR-0007
- ADR-0008

---

## ✅ Sprint 5.1 — Architecture Refactor

- Stable WebView lifecycle
- WebviewSync manager
- Imperative orchestration
- Deterministic synchronization
- Stable renderer ownership
- Simplified browser lifecycle

---

## ✅ Sprint 5.2 — UI & UX Polish

- Refined expanded sidebar
- Refined collapsed sidebar
- Improved spacing
- Better navigation hierarchy
- Workspace visual improvements
- Enhanced transitions
- Improved desktop experience

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
├── Browser Services
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

Every layer owns one responsibility and communicates through well-defined interfaces.

---

# Roadmap

## ✅ Milestone 1 — Browser Foundation _(Completed)_

- Browser shell
- Browser core
- Navigation
- Persistence
- Workspace Engine
- Stable renderer lifecycle
- Desktop UI polish

---

## 🟨 Milestone 2 — Intelligence Foundation

- Workspace-aware history
- Workspace-aware bookmarks
- Semantic search
- Intelligent command palette
- Content understanding
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
- Native integrations
- Cross-platform CI/CD

---

# Repository Structure

```text
src/
    React frontend

src-tauri/
    Rust backend

docs/
    ADRs
    Architecture
    Sprint Reports
    Engineering Notes

assets/
    Application assets

public/
    Static resources
```

---

# Engineering Standards

Orbit follows a disciplined engineering process built around long-term maintainability.

- Strict TypeScript
- Layered architecture
- Domain-driven design
- Rust-first persistence
- Architecture Decision Records (ADRs)
- Event-driven communication
- Imperative native resource management
- Structured logging
- Database migrations
- Automated linting & formatting
- Git hooks
- Sprint-based incremental development

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

Every sprint answers one architectural question:

- **Sprint 1** — Can Orbit exist?
- **Sprint 2** — Can Orbit feel like Orbit?
- **Sprint 3** — Can Orbit browse?
- **Sprint 4** — Can Orbit remember?
- **Sprint 5** — Can Orbit organize?
- **Sprint 5.1** — Can Orbit remain stable under real-world usage?
- **Sprint 5.2** — Can Orbit feel polished?

The next chapter begins with **Sprint 6**:

> **Can Orbit understand?**
