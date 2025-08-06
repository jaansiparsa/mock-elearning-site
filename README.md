# Brex-MVP - T3 App with Basic Authentication

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app` and configured with basic username/password authentication.

## Features

- **Basic Authentication**: Username/password login system (no OAuth)
- **User Registration**: Sign up with email and password
- **Secure Password Hashing**: Passwords are hashed using bcrypt
- **Protected Routes**: Dashboard page requires authentication
- **Modern UI**: Built with Tailwind CSS and responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   DATABASE_URL="file:./db.sqlite"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

   You can generate a secret key with:

   ```bash
   openssl rand -base64 32
   ```

4. Set up the database:

   ```bash
   npm run db:push
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Authentication Flow

1. **Sign Up**: Visit `/auth/signup` to create a new account
2. **Sign In**: Visit `/auth/signin` to log in with your credentials
3. **Dashboard**: Once logged in, visit `/dashboard` to see your account information
4. **Sign Out**: Use the sign out button to log out

### Pages

- `/` - Home page with authentication status
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/dashboard` - Protected dashboard (requires authentication)

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [NextAuth.js](https://next-auth.js.org) - Authentication
- [Prisma](https://prisma.io) - Database ORM
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [tRPC](https://trpc.io) - Type-safe APIs
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Password hashing

## Database Schema

The app uses SQLite with the following main models:

- `User` - User accounts with email, name, and hashed password
- `Session` - NextAuth session management
- `Account` - NextAuth account linking (for future OAuth support)

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 12
- Session-based authentication with JWT tokens
- Protected routes with server-side authentication checks
- Input validation on signup and signin forms

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Prisma Studio

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available)

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## Deployment

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
