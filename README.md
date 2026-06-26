# 🌍 Orbit

> **A modern web workspace built for focus, context, and intentional browsing.**

Orbit is an experimental desktop application that reimagines the traditional browser as a **workspace-oriented environment** rather than simply a collection of tabs.

Rather than organizing browsing around windows and bookmarks alone, Orbit is designed to organize work around **projects, sessions, context, and workflows**, helping users stay focused and preserve the intent behind their browsing.

---

# 🚀 Current Status

**Current Version:** **v0.4.0**

**Development Stage:** Active

Orbit has completed its first four engineering sprints and now includes:

- Modern desktop shell
- Functional browser core
- Persistent storage layer
- History and bookmarks
- Session persistence
- Command Palette foundation
- Layered architecture with documented engineering decisions

The project is currently transitioning toward its next major milestone: **Workspace Engine**.

---

# Vision

Modern browsers are excellent at rendering web pages.

Orbit explores a different question:

> **What if a browser understood why you opened a page, not just what page you opened?**

Orbit aims to become a workspace where information is organized around:

- Projects
- Sessions
- Research
- Collections
- Context
- Workflows

instead of simply accumulating tabs.

---

# Engineering Philosophy

Orbit is guided by several long-term engineering principles.

## Context over Tabs

People work on goals—not on tabs.

Orbit aims to preserve context so users can return to meaningful work rather than reconstructing it from browser history.

---

## Architecture Before Features

Every major capability is built on stable architectural foundations.

Long-term maintainability takes priority over short-term convenience.

---

## Separation of Concerns

Each subsystem owns one responsibility.

- Shell owns presentation.
- Browser owns navigation.
- Renderer owns rendering.
- Persistence owns storage.

This keeps Orbit modular and adaptable as it grows.

---

## Local-First by Design

User data belongs to the user.

Orbit stores data locally whenever possible and treats cloud connectivity as an optional enhancement rather than a requirement.

---

## Performance First

Orbit is built with lightweight native technologies.

The goal is fast startup, low memory usage, and responsive interactions without sacrificing maintainability.

---

## Privacy by Design

Orbit is designed to minimize unnecessary data collection.

Future intelligence features are planned with local processing as the default whenever practical.

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

Established the engineering foundation.

- Tauri v2
- React + TypeScript
- Rust backend
- IPC bridge
- Zustand
- React Router
- Tailwind CSS
- ESLint
- Prettier
- Husky
- ADR-0001

---

## ✅ Sprint 2 — Orbit Shell

Built the application shell.

- Custom title bar
- Sidebar
- Toolbar
- Address bar
- Tab interface
- Design token system
- Theme support
- Layout architecture
- ADR-0002

---

## ✅ Sprint 3 — Browser Core

Orbit became a functional browser.

- BrowserFacade architecture
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

Orbit learned to remember.

- SQLite integration
- sqlx persistence
- Database migrations
- History
- Bookmarks
- Session persistence
- Settings persistence
- Command Palette foundation
- PersistenceService
- Repository architecture
- ADR-0005
- ADR-0006

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

Every layer has a single responsibility and communicates through well-defined interfaces.

---

# Roadmap

## 🟦 Milestone 1 — Browser Foundation _(Completed)_

- Browser shell
- Navigation
- Tabs
- Browser rendering
- History
- Bookmarks
- Session persistence
- Settings persistence

---

## 🟨 Milestone 2 — Workspace Engine _(In Progress)_

- Workspaces
- Workspace switching
- Workspace sessions
- Collections
- Command Palette expansion
- Unified search
- Recent activity

---

## 🟩 Milestone 3 — Productivity Layer

- Downloads
- Notes
- Split view
- Pinning
- Smart organization
- Advanced search

---

## 🟪 Milestone 4 — Intelligence Layer

- Context awareness
- Local AI
- Semantic search
- Intelligent suggestions
- Workspace memory

---

## 🟥 Milestone 5 — Orbit + RaghavOS

- Resource integration
- Session synchronization
- Native automation
- Shared workspace model
- Cross-application workflows

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
- Modular architecture
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

Contribution guidelines will be published once the project reaches a stable public milestone.

---

# License

MIT License

---

# Acknowledgements

Orbit is part of a broader exploration into productivity-focused desktop software and modern application architecture.

Each sprint is designed to answer a single architectural question while strengthening the overall engineering foundation:

- **Sprint 1:** Can Orbit exist?
- **Sprint 2:** Can Orbit feel like Orbit?
- **Sprint 3:** Can Orbit browse?
- **Sprint 4:** Can Orbit remember?

The next step is equally important:

> **Sprint 5 — Can Orbit organize?**
