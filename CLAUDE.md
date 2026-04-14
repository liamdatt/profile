# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NFC Profile Manager — a mobile-first web app for digital profile pages linked to physical NFC cards. Users sign up, get admin-approved, then create a public profile at `/<username>`.

## Commands

- `npm run dev` — start Next.js dev server
- `npm run build` — generate Prisma client + build Next.js
- `npm run lint` — ESLint (next/core-web-vitals + typescript configs)
- `npm test` — run Vitest unit tests
- `npm run test:e2e` — run Playwright e2e tests (requires dev server on :3000)
- `npm run db:migrate` — run Prisma migrations locally
- `npm run db:seed` — seed admin user from env values
- `docker compose up -d` — start Postgres and MinIO

Run a single unit test: `npx vitest run tests/unit/validators.test.ts`

## Architecture

**Hybrid Next.js app** using both App Router (`app/`) and Pages Router (`pages/api/`):

- **App Router** (`app/`) — all page UI. Route groups: `(auth)` for sign-in/sign-up/pending-approval, `(app)` for dashboard/admin. Dynamic `[username]` route serves public profiles.
- **Pages Router** (`pages/api/`) — all API routes. Auth via NextAuth (`[...nextauth].ts`), registration, admin user management, profile updates, photo uploads, asset proxy, and vCard contact downloads.
- **Middleware** (`proxy.ts`) — NextAuth `withAuth` middleware protecting `/dashboard` and `/admin` routes.

**Auth**: NextAuth v4 with credentials provider (email/password via argon2). JWT strategy with role/status embedded in token. Users start as `PENDING` and require admin approval before accessing dashboard.

**Database**: PostgreSQL via Prisma with the `@prisma/adapter-pg` driver adapter. Schema in `prisma/schema.prisma`. Prisma config uses `prisma.config.ts` which loads `.env` then `.env.local`. The Prisma client singleton is in `lib/prisma.ts` (uses `lib/prisma-client.ts` for construction with the pg adapter).

**Storage**: MinIO (S3-compatible) for profile photos and backgrounds. Assets are proxied through `pages/api/assets/[...path].ts`.

**Path alias**: `@/*` maps to project root.

**Node requirement**: >=22.12.0

## Key Enums/Types

Roles: `ADMIN`, `USER`. User status: `PENDING`, `APPROVED`, `REJECTED`. Themes: `MIDNIGHT`, `OCEAN`, `SUNSET`, `PAPER`, `NOIR_GOLD`, `AURORA`, `ROSE_MARBLE`, `OBSIDIAN`. Layouts: `CENTERED`, `SPLIT`, `EDITORIAL`. Link kinds: `INSTAGRAM`, `LINKEDIN`, `YOUTUBE`, `TWITTER`, `CUSTOM`.

## Testing

- Unit tests live in `tests/unit/` and run with Vitest (node environment).
- E2e tests go in `tests/e2e/` and run with Playwright against mobile Chrome (Pixel 7 device).
