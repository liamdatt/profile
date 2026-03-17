Here is a Product Requirements Document (PRD) tailored for your NFC digital profile platform.

# Product Requirements Document (PRD): NFC Profile Manager

## 1. Product Overview

**Purpose:** A web application that allows users to create, manage, and customize digital profiles linked to physical NFC cards. The platform serves as the digital bridge between a physical tap and a user's online presence.
**Target Audience:** Customers who have purchased an NFC card and need a centralized, customizable landing page to share their contact and social information.

## 2. Technology Stack

- **Frontend & Framework:** Next.js (App Router recommended for optimal server-side rendering and SEO).
- **Database:** PostgreSQL (to handle relational data like users, profiles, and theme preferences).
- **Object Storage:** MinIO (for secure, scalable profile photo uploads).
- **Authentication:** NextAuth.js / Auth.js (for secure session management, credential flows, and route protection).

The combination of Next.js, PostgreSQL, and MinIO is a highly effective architecture. Much like building a data-heavy application such as an equity insights report generator, this stack ensures rapid relational queries from Postgres and reliable media handling through MinIO, all served seamlessly by Next.js.

## 3. Core Features & Requirements

### 3.1. Authentication & Admin Approval Flow

- **Signup/Login:** Users register via an email/password flow managed by NextAuth.
- **Pending State:** Upon registration, the user account is flagged as `pending_approval`. They cannot publish a profile or receive a public URL yet.
- **Admin Dashboard:** A protected route (e.g., `/admin`) accessible only to users with the `ADMIN` role. Admins can view pending signups and click "Approve" or "Reject".
- **Activation:** Once approved, the user gains full access to the Profile Creator.

### 3.2. Profile Creator & Management

- **Unique Username Claim:** Users must select a unique username which will generate their public route (`example.com/[username]`).
- **Media Upload:** Users can upload a profile photo. The Next.js backend will handle the file buffer, push it to your MinIO bucket, and store the returned object URL in PostgreSQL.
- **Basic Information:** Text fields for Display Name and Bio.
- **Link Management:**
  - **Social Media:** Dedicated input fields with validation for Instagram, LinkedIn, YouTube, and Twitter.
  - **Custom Links:** Ability to add dynamic title/URL pairs for personal websites, portfolios, or external stores.

### 3.3. Customization & Theming

- **Preset Themes:** Users can select from a predefined list of color palettes (e.g., "Dark Mode", "Ocean", "Sunset", "Minimalist").
- **Live Preview:** The dashboard should feature a live iframe or component preview showing the user exactly what their public profile will look like as they apply changes.

### 3.4. Public Profile Delivery

- **Dynamic Routing:** The `app/[username]/page.tsx` route will dynamically fetch the user's data from PostgreSQL based on the URL parameter.
- **Read-Only View:** This mobile-responsive page displays the profile photo, bio, social icons, and customized theme.
- **NFC Linking:** The physical NFC card will be externally encoded to point directly to the user's generated `https://example.com/username` link.

## 4. User Flows

1.  **Onboarding:** User buys an NFC card $\rightarrow$ Visits web app $\rightarrow$ Signs up $\rightarrow$ Sees "Awaiting Admin Approval" screen.
2.  **Approval:** Admin logs in $\rightarrow$ Approves user $\rightarrow$ User logs in and gains dashboard access.
3.  **Profile Setup:** User claims `username` $\rightarrow$ Uploads photo to MinIO $\rightarrow$ Fills out bio $\rightarrow$ Adds social links $\rightarrow$ Selects theme $\rightarrow$ Saves.
4.  **End-User Interaction:** A person taps the physical NFC card $\rightarrow$ Their smartphone opens `example.com/username` $\rightarrow$ They view and interact with the digital profile.

## 5. High-Level Data Model (PostgreSQL)

- **User Table:** `id`, `email`, `password_hash`, `role` (USER/ADMIN), `status` (PENDING/APPROVED), `created_at`.
- **Profile Table:** `id`, `user_id` (FK), `username` (UNIQUE), `display_name`, `bio`, `profile_photo_url` (MinIO path), `theme_id`.
- **Links Table:** `id`, `profile_id` (FK), `platform` (Instagram, Twitter, Custom, etc.), `url`, `order_index`.

## 6. Security & Performance Considerations

- **Route Protection:** Use Next.js Middleware combined with NextAuth to ensure unapproved users cannot access the `/dashboard` or API routes.
- **Image Optimization:** Utilize the Next.js `<Image />` component to serve optimized, correctly sized profile photos from MinIO, reducing load times on mobile networks.
- **Rate Limiting:** Protect the signup and login endpoints to prevent brute-force attacks.

---
