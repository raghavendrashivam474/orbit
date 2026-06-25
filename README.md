# 🌍 Orbit

> **A modern web workspace built for focus, context, and intentional browsing.**

Orbit is an experimental desktop application that reimagines the traditional browser as a **workspace-oriented environment** rather than simply a collection of tabs.

Instead of organizing browsing around windows and bookmarks, Orbit aims to organize work around **projects, sessions, and context**, helping users move seamlessly between different aspects of their digital life.

---

## 🚧 Project Status

**Current Version:** Sprint 1 (Foundation)

Orbit is currently in active development.

Sprint 1 establishes the engineering foundation of the project, including the desktop framework, frontend architecture, Rust backend, development tooling, and project standards.

No end-user browser features have been implemented yet.

---

# Vision

Modern browsers have become excellent at rendering web pages.

Orbit explores a different question:

> **What if a browser understood _why_ you opened a page, not just _what_ page you opened?**

The long-term goal is to evolve Orbit into a workspace that manages:

- Projects
- Research
- Sessions
- Context
- Collections
- Workflows

rather than simply managing tabs.

---

# Design Philosophy

Orbit is guided by several long-term engineering principles.

## Intent over Tabs

Users work on goals—not on tabs.

Orbit aims to organize browsing around meaningful contexts rather than endless tab lists.

---

## Context First

A browser should remember more than URLs.

Orbit will gradually introduce contextual workspaces that preserve the state of ongoing work.

---

## Minimal by Default

Powerful software does not need to be visually overwhelming.

Orbit prioritizes clarity, performance, and simplicity.

---

## Performance First

Orbit is designed as a lightweight desktop application using modern native technologies.

The focus is on responsiveness, low resource usage, and maintainability.

---

## Privacy by Design

Orbit is intended to be local-first wherever possible.

User data should remain under the user's control.

---

# Technology Stack

| Layer             | Technology   |
| ----------------- | ------------ |
| Desktop Framework | Tauri v2     |
| Backend           | Rust         |
| Frontend          | React 19     |
| Language          | TypeScript   |
| Build Tool        | Vite         |
| Styling           | Tailwind CSS |
| State Management  | Zustand      |
| Routing           | React Router |
| Package Manager   | pnpm         |

---

# Current Progress

## ✅ Sprint 1 — Project Foundation

Completed:

- Project scaffold
- Tauri v2 integration
- React + TypeScript setup
- Rust backend
- IPC bridge
- Zustand state management
- React Router
- Tailwind CSS
- ESLint
- Prettier
- Husky
- Documentation
- Architecture Decision Record (ADR-0001)

---

# Planned Roadmap

## Milestone 1 — Orbit Core

- Browser shell
- Navigation
- Tabs
- Address bar
- Bookmarks
- History
- Downloads
- Settings

---

## Milestone 2 — Orbit Workspace

- Workspaces
- Sessions
- Collections
- Command Palette
- Unified Search

---

## Milestone 3 — Orbit Intelligence

- Context awareness
- Smart suggestions
- Local AI integration
- Semantic search

---

## Milestone 4 — Orbit + RaghavOS

- Resource integration
- Session synchronization
- Native automation
- Deep ecosystem integration

---

## Milestone 5 — Orbit Ecosystem

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
    Architecture decisions
    Guides
    Sprint documentation

assets/
    Application assets
```

---

# Engineering Standards

Orbit is developed with an emphasis on long-term maintainability.

The project follows:

- Strict TypeScript
- Modular architecture
- Architecture Decision Records (ADRs)
- Structured logging
- Automated linting and formatting
- Git hooks for quality assurance
- Incremental sprint-based development

---

# Contributing

Orbit is currently under active architectural development.

Contribution guidelines will be published once the project reaches a stable milestone.

---

# License

This project is licensed under the MIT License.

---

## Acknowledgements

Orbit is being developed as part of a broader exploration into productivity-focused desktop software and modern application architecture.

Every sprint is treated as an opportunity to build not only features, but also engineering practices that support the project's long-term evolution.
