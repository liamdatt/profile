# NFC Profile Manager

Mobile-first digital profile pages for NFC cards, built with Next.js, PostgreSQL, and MinIO.

## Local stack

1. Copy `.env.example` to `.env.local`.
2. Start local services:

```bash
docker compose up -d
```

3. Generate the Prisma client and run migrations:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

4. Start the app:

```bash
npm run dev
```

MinIO is exposed at `http://127.0.0.1:9000` and its console at `http://127.0.0.1:9001`.

## Scripts

- `npm run dev` starts the Next.js app.
- `npm run lint` runs ESLint.
- `npm test` runs Vitest.
- `npm run db:generate` regenerates Prisma Client.
- `npm run db:migrate` runs local Prisma migrations.
- `npm run db:seed` seeds the first admin user from env values.

## Product surface

- Public profile pages live at `/<username>`.
- Customer auth uses email/password with pending approval.
- Approved users manage their profile in `/dashboard`.
- Admin approval actions live in `/admin`.
