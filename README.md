# Better Auth Implementation

A comprehensive Next.js 16 authentication implementation using [Better Auth](https://www.better-auth.com/), Drizzle ORM, and PostgreSQL. This project showcases advanced authentication features, including 2FA, Passkeys, Organization management, and Stripe integration.

## 🚀 Key Features

- **Advanced Authentication**: Powered by Better Auth with support for:
    - Email & Password (with verification and reset flows).
    - Social Logins (GitHub, Discord).
    - **Two-Factor Authentication (2FA)**: Secure your accounts with an extra layer of protection.
    - **Passkeys**: Passwordless login using biometric or hardware security keys.
- **Organization & Team Management**: Create organizations, invite members, and manage roles.
- **Admin Dashboard**: Role-based access control with administrative capabilities.
- **Subscription Management**: Seamlessly integrated with **Stripe** for handling plans and payments.
- **Security & Performance**:
    - **Arcjet Integration**: Advanced security features like IP protection and bot detection.
    - **Optimized Sessions**: Cookie-based session caching for faster performance.
- **Automated Email Flows**: Personalized emails for welcome, verification, password resets, and organization invites.
- **Modern UI/UX**: Built with **shadcn/ui**, **Radix UI**, and Styled with **Tailwind CSS 4**.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [Better Auth](https://www.better-auth.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Security**: [Arcjet](https://arcjet.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)

## 📂 Project Structure

```text
├── app/                  # Next.js App Router (pages and layouts)
├── components/           # UI components (shadcn and custom auth components)
├── drizzle/              # Database schema and migrations
├── lib/                  # Core logic, auth configuration, and utilities
│   ├── auth/             # Better Auth configuration
│   └── emails/           # Email templates and sending logic
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## ⚙️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- PostgreSQL database
- Stripe Account (for payments)
- GitHub/Discord Developer Apps (for social auth)
- Arcjet API Key (for security features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tahsin005/better-auth
   cd better-auth
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in the required values:
   ```bash
   cp .env.example .env
   ```

4. Database Setup:
   Generate and push the schema to your database:
   ```bash
   npm run db:push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run db:push`: Pushes schema changes to the database.
- `npm run db:studio`: Opens Drizzle Studio to explore your data.
- `npm run auth:generate`: Generates Better Auth schema for Drizzle.