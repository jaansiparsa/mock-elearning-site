# skillEd - E-Learning Platform

A modern, feature-rich e-learning platform built with Next.js, featuring course management, assignment tracking, analytics, and user authentication.

## Features

- **User Authentication**: Secure login/signup system with role-based access
- **Course Management**: Create, enroll, and manage courses with lessons
- **Assignment System**: Submit assignments with tracking and grading
- **Learning Analytics**: Comprehensive progress tracking and performance insights
- **User Profiles**: Customizable profiles with learning preferences
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live assignment submissions and progress tracking

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI components
- **Authentication**: NextAuth.js with custom credentials
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Charts**: Recharts for data visualization
- **State Management**: React hooks, tRPC for type-safe APIs

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd elearning_research
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./db.sqlite"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: For production databases
# DATABASE_URL="postgresql://username:password@localhost:5432/skilled_db"
```

Generate a secure secret key:

```bash
openssl rand -base64 32
```

### 4. Database Setup

#### Initial Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database with sample data
npm run db:seed
```

#### Database Migrations (for production)

```bash
# Create a new migration
npx prisma migrate dev --name "migration_name"

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── courses/           # Course-related pages
│   ├── assignments/       # Assignment pages
│   ├── analytics/         # Analytics dashboard
│   └── profile/           # User profile pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── courses/          # Course-related components
│   ├── assignments/      # Assignment components
│   ├── analytics/        # Analytics components
│   └── profile/          # Profile components
├── server/               # Server-side code
│   ├── api/              # tRPC API routers
│   ├── auth/             # Authentication configuration
│   └── db.ts             # Database connection
└── types/                # TypeScript type definitions
```

## Database Schema

The platform uses the following main models:

- **User**: User accounts with roles (student, instructor, admin)
- **Course**: Courses with lessons, enrollments, and metadata
- **Lesson**: Individual learning units within courses
- **Assignment**: Course assignments with due dates and submissions
- **AssignmentSubmission**: Student submissions with grading
- **UserProgress**: Learning progress tracking
- **Analytics**: Performance metrics and learning data

## Key Features Walkthrough

### Authentication

- Visit `/auth/signup` to create an account
- Use `/auth/signin` to log in
- Protected routes automatically redirect to login

### Course Management

- Browse available courses at `/explore`
- Enroll in courses from the course detail page
- Access enrolled courses from `/dashboard`

### Assignment System

- View assignments in course detail pages
- Submit assignments with files and text content
- Track submission status and grades

### Analytics Dashboard

- Monitor learning progress at `/analytics`
- View performance trends and achievements
- Set weekly learning goals

### User Profile

- Customize profile information at `/profile`
- Set learning preferences and study times
- Update account settings and password

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with sample data

# Linting & Formatting
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/check` - Check authentication status

### Courses

- `GET /api/courses` - List all courses
- `GET /api/courses/[courseId]` - Get course details
- `POST /api/courses/[courseId]/enroll` - Enroll in course

### Assignments

- `GET /api/assignments` - List user assignments
- `GET /api/assignments/[assignmentId]` - Get assignment details
- `POST /api/assignments/submit` - Submit assignment

### Profile

- `PUT /api/profile/update` - Update user profile
- `PUT /api/profile/preferences` - Update learning preferences
- `POST /api/profile/check-username` - Check username availability

## Environment Variables

| Variable          | Description                 | Required |
| ----------------- | --------------------------- | -------- |
| `DATABASE_URL`    | Database connection string  | Yes      |
| `NEXTAUTH_SECRET` | Secret key for JWT tokens   | Yes      |
| `NEXTAUTH_URL`    | Base URL for authentication | Yes      |

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure `.env` file exists with correct `DATABASE_URL`
   - Run `npx prisma generate` and `npx prisma db push`

2. **Authentication Issues**
   - Check `NEXTAUTH_SECRET` is set correctly
   - Verify `NEXTAUTH_URL` matches your development URL

3. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

4. **TypeScript Errors**
   - Run `npx prisma generate` to update Prisma client types
   - Check for missing imports or type definitions

### Getting Help

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Prisma documentation](https://www.prisma.io/docs)
- Open an issue in the repository

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

- **Netlify**: Configure build settings and environment variables
- **Railway**: Connect repository and set environment variables
- **Docker**: Use provided Dockerfile for containerized deployment

## Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code examples in the components
