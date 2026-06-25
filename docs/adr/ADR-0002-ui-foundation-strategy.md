# ADR-0002 — UI Foundation Strategy

**Status:** Accepted
**Date:** 2026-06-25
**Sprint:** 2 — Shell

## Decision

Build Orbit's design system using native CSS variables and Tailwind CSS.
Defer shadcn/ui until Sprint 3.

## Design Token Architecture

    tokens.css     Design primitives (colors, spacing, radii, motion)
    theme.css      Dark/light semantic mappings
    animations.css Centralized animation library
    utilities.css  Orbit-specific helper classes

## Why Not shadcn/ui in Sprint 2

Sprint 2 builds highly custom chrome components:
title bar, tab bar, sidebar, window controls, address bar.
These do not map to shadcn/ui primitives.
Forcing them would mean fighting the library rather than using it.

## Planned shadcn/ui Introduction (Sprint 3)

Dialog, Popover, Dropdown, Toast, Command Palette,
Settings Forms, Context Menu.

## Design Token Values

Background    #0B1020
Surface       #111827
Elevated      #1A2235
Border        #2A3650
Primary       #3B82F6
Purple        #8B5CF6
Success       #22C55E
Warning       #F59E0B
Danger        #EF4444

Radius sm/md/lg/xl  8/12/16/24px
Motion              150-200ms
Border              1px solid

## Consequences

Every pixel in Orbit's chrome belongs to Orbit.
No external component library assumptions.
Clean path to introduce shadcn/ui selectively in Sprint 3.