# 🌍 Orbit

> **A context-first native workspace browser designed to preserve, organize, and progressively understand digital work.**

Orbit is a native desktop browser that reimagines browsing around **workspaces, context, and continuity** instead of windows and isolated tabs.

Traditional browsers remember pages.

Orbit remembers **work**.

Rather than treating tabs as the primary unit of browsing, Orbit models browsing around persistent workspaces, structured context, and long-term project continuity.

Its long-term vision is to become an intelligent workspace companion that helps users organize, retrieve, and eventually understand their digital work while keeping complete ownership of their data.

---

# 🚀 Current Status

**Version:** **v0.6.0**

**Stage:** Context Engine Foundation Complete

Orbit has completed its first two major architectural milestones.

Current capabilities include:

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
- Structured Context Engine
- Global Page identity
- Workspace-scoped Page Visits
- Context Query API
- Workspace timeline projection
- Lexical context search
- Layered Rust + TypeScript architecture
- Architecture Decision Records (ADRs)

Orbit now understands the structural relationships between browsing activity instead of merely storing browser state.

The next phase focuses on turning structured context into practical intelligence.

---

# 🌟 Vision

Modern browsers answer one question:

> **"Which page should I open?"**

Orbit explores a different question:

> **"Can a browser understand what I'm working on?"**

Orbit aims to organize digital work around:

- Workspaces
- Projects
- Sessions
- Context
- Research
- Knowledge
- Collections
- Intent

instead of disconnected browser tabs.

---

# 🧭 Product Philosophy

## 🏠 Workspaces over Windows

Windows are temporary.

Workspaces represent long-term projects and meaningful contexts.

---

## 🧠 Context over Tabs

Tabs are disposable.

Context is durable.

Orbit preserves the complete working context behind browsing activity rather than simply restoring pages.

---

## 🏗 Architecture Before Features

Every architectural layer is completed before introducing dependent capabilities.

Long-term maintainability always takes priority over feature velocity.

---

## ⚙ Deterministic Native Resource Management

Native WebViews are synchronized explicitly through dedicated lifecycle managers.

Rendering is never driven by implicit UI state.

---

## 🎯 One Source of Truth

Every domain has one authoritative owner.

Derived layers synchronize from that source rather than maintaining duplicated state.

---

## 👁 Observation Before Intelligence

Orbit first observes.

Then structures.

Only then attempts to understand.

Future intelligence features will consume structured context instead of raw browser state.

---

## 💾 Local First

User information remains local whenever practical.

Cloud synchronization remains an optional future enhancement.

---

## 🔒 Privacy by Design

Future intelligence capabilities are designed around local execution whenever practical.

Users retain ownership of their information.

---

## ⚡ Performance First

Orbit favors deterministic architecture over unnecessary abstraction.

Every feature must preserve responsiveness and predictable behavior.

---

# 🏛 Engineering Principles

Orbit follows:

- Layered Architecture
- Domain-Driven Design
- Strict TypeScript
- Rust-first persistence
- Observer-driven synchronization
- Deterministic native lifecycle management
- Investigation before implementation
- Incremental architectural evolution
- Architecture Decision Records (ADRs)
- Structured logging
- Database migrations
- Automated linting & formatting
- Git hooks
- Sprint-based development

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
- Tooling
- ADR-0001

---

## ✅ Sprint 2 — Orbit Shell

- Native desktop shell
- Title bar
- Sidebar
- Toolbar
- Address bar
- Tabs
- Theme support
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
- History
- Bookmarks
- Session persistence
- Settings persistence
- Repository architecture
- ADR-0005
- ADR-0006

---

## ✅ Sprint 5 — Workspace Engine

- Workspace CRUD
- Workspace switching
- Workspace snapshots
- Active workspace persistence
- Per-workspace tabs
- Active tab restoration
- Workspace sidebar
- ADR-0007
- ADR-0008

---

## ✅ Sprint 5.1 — Browser Architecture Refactor

- WebviewSync
- Deterministic renderer ownership
- Imperative native orchestration
- Stable browser lifecycle

---

## ✅ Sprint 5.2 — Desktop UI Polish

- Sidebar refinement
- Workspace hierarchy improvements
- Improved desktop UX
- UI consistency

---

## ✅ Sprint 5.3 — Browser Stabilization

- NavigationObserver
- Observer-driven persistence
- History restoration
- Browser stabilization

---

## ✅ Sprint 5.4 — Context Preservation

- Workspace snapshots
- Active tab restoration
- Workspace restart recovery
- Stable workspace replacement
- Browser foundation completed

---

## ✅ Sprint 6 — Context Engine Foundation

- Global Page identity
- Workspace-scoped Page Visits
- ContextCaptureService
- ContextQueryService
- URL normalization
- Context persistence
- Lexical context search
- Timeline projection
- Context architecture
- ADR-0009
- ADR-0010

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
├── Workspace Store
└── Workspace Snapshot
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
Context Engine
│
├── ContextCaptureService
├── ContextQueryService
├── Page Repository
├── PageVisit Repository
├── Page Identity
└── Workspace Context
│
▼
Persistence Layer
│
├── Rust Services
├── Rust Repositories
├── TypeScript Repositories
└── SQLite (sqlx)
```

Every layer owns exactly one responsibility.

Browser activity flows into the Context Engine.

Future intelligence consumes the Context Engine.

---

# 🏆 Development Roadmap

## ✅ Milestone 1 — Browser Foundation

Completed.

- Browser shell
- Browser core
- Persistence
- Workspace Engine
- Browser stabilization

---

## ✅ Milestone 2 — Context Foundation

Completed.

- Context Engine
- Page identity
- Page visits
- Workspace context
- Context search
- Timeline projection

---

## 🟨 Milestone 3 — Intelligence Foundation

Current Focus

Planned capabilities:

- Real metadata extraction
- Page understanding
- Workspace understanding
- Semantic search
- Intelligent Command Palette
- Local AI memory
- Workspace intelligence

---

## 🟩 Milestone 4 — Productivity Layer

- Notes
- Downloads
- Split View
- Collections
- Smart organization
- Advanced search

---

## 🟪 Milestone 5 — Orbit + RaghavOS

- Shared sessions
- Native automation
- Workspace synchronization
- Cross-application workflows

---

## 🟥 Milestone 6 — Orbit Ecosystem

- Plugin SDK
- Themes
- Marketplace
- Community extensions

---

## 🌍 Milestone 7 — Cross-Platform Expansion

- macOS
- Linux
- Platform abstraction
- Native integrations
- Cross-platform CI/CD

---

# 📊 Current State

Orbit has successfully completed:

- Browser Foundation
- Workspace Engine
- Context Engine

The browser is now capable of preserving, structuring, and querying browsing context.

Future work focuses on understanding context rather than collecting it.

Known platform limitations remain:

- Child WebView title extraction
- Native metadata extraction
- Operating-system controlled shortcut behavior

These are platform constraints rather than architectural limitations.

---

# 📋 Engineering Standards

Orbit maintains:

- Strict TypeScript
- Layered Architecture
- Domain-Driven Design
- Rust-first persistence
- Observer-driven synchronization
- Context-first architecture
- Deterministic native resource management
- ADRs
- Structured logging
- Database migrations
- Automated linting & formatting
- Git hooks
- Sprint-based development
- Clean Git history
- Comprehensive documentation

---

# 📄 License

MIT License

---

# 🙏 Acknowledgements

Every sprint answered one architectural question.

| Sprint     | Question                                     |
| ---------- | -------------------------------------------- |
| Sprint 1   | Can Orbit exist?                             |
| Sprint 2   | Can Orbit feel like Orbit?                   |
| Sprint 3   | Can Orbit browse?                            |
| Sprint 4   | Can Orbit remember?                          |
| Sprint 5   | Can Orbit organize?                          |
| Sprint 5.1 | Can Orbit remain deterministic?              |
| Sprint 5.2 | Can Orbit feel polished?                     |
| Sprint 5.3 | Can Orbit recover from architectural change? |
| Sprint 5.4 | Can Orbit preserve context?                  |
| Sprint 6   | Can Orbit structure context?                 |

The next architectural chapter begins with:

> **Sprint 7 — Can Orbit understand context?**
