# Backend Integration Analysis - skillEd E-Learning Platform

## Executive Summary

This document provides a comprehensive analysis of the backend integration requirements for the skillEd e-learning platform. The platform currently uses Next.js API routes with Prisma ORM and NextAuth.js for authentication. This analysis identifies current capabilities, gaps, and recommendations for backend team integration.

## Current Architecture Overview

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Prisma ORM with SQLite (development) / PostgreSQL (production)
- **Authentication**: NextAuth.js v5 with custom credentials provider
- **API Layer**: Next.js API routes + tRPC for type-safe APIs
- **State Management**: React Query (TanStack Query) with tRPC
- **Real-time**: Currently none - all updates are request-response based

### Current API Structure

The platform uses a hybrid approach:

1. **Next.js API Routes** (`/api/*`) for RESTful endpoints
2. **tRPC** for type-safe, internal API calls
3. **Direct Database Access** via Prisma in server components

## API Requirements Analysis

### Current API Endpoints

#### Authentication & User Management

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/check` - Authentication status check
- `POST /api/users/register` - Alternative registration endpoint
- `GET /api/users/[userId]/profile` - Get user profile

#### Course Management

- `GET /api/courses` - List courses with filtering, pagination, and statistics
- `POST /api/courses` - Create new course (instructor only)
- `GET /api/courses/[courseId]` - Get course details with lessons, assignments, prerequisites
- `POST /api/courses/[courseId]/enroll` - Enroll in course
- `GET /api/courses/[courseId]/lessons` - Get course lessons
- `GET /api/courses/[courseId]/assignments` - Get course assignments

#### Assignment System

- `GET /api/assignments` - Get user assignments with filtering (status, course, sort)
- `GET /api/assignments/[assignmentId]` - Get assignment details with submissions
- `POST /api/assignments/submit` - Submit assignment

#### Profile & Preferences

- `PUT /api/profile/update` - Update user profile
- `PUT /api/profile/preferences` - Update learning preferences
- `POST /api/profile/check-username` - Check username availability

#### Analytics & Progress

- `GET /api/analytics` - Get analytics for authenticated user
- `GET /api/analytics/[userId]` - Get user analytics data with period filtering
- `GET /api/analytics/[userId]/courses` - Get course-specific analytics and progress

#### Lessons & Learning

- `POST /api/lessons/complete` - Mark lesson as completed

#### Achievements & Gamification

- `GET /api/achievements/[studentId]` - Get user achievements and potential achievements

#### User Management

- `GET /api/users/[userId]/profile` - Get detailed user profile with statistics

#### Admin & System

- `POST /api/admin/fix-assignments` - Admin tool for fixing assignment data

#### Recommendations

- `GET /api/recommendations` - Get course recommendations for user

### API Response Patterns

The platform uses consistent response structures:

```typescript
// Success Response
{
  data?: T;
  message?: string;
}

// Error Response
{
  error: string;
  status?: number;
}
```

## Real-Time Features Requirements

### Current State: No Real-Time Features

The platform currently lacks real-time capabilities, which are essential for:

- Live assignment submissions
- Real-time grading updates
- Course announcements
- Student-instructor communication
- Progress tracking updates

### Required Real-Time Features

#### WebSocket Implementation

```typescript
// WebSocket event types needed
interface WebSocketEvents {
  // Assignment updates
  "assignment.submitted": { assignmentId: string; studentId: string };
  "assignment.graded": {
    assignmentId: string;
    studentId: string;
    grade: number;
  };

  // Course updates
  "course.updated": { courseId: string; changes: Partial<Course> };
  "lesson.completed": { lessonId: string; studentId: string };

  // Communication
  "message.received": { messageId: string; from: string; content: string };
  "announcement.posted": { announcementId: string; courseId: string };

  // System notifications
  "notification.new": { notificationId: string; userId: string; type: string };
}
```


## Authentication & User Session Management

- **Strategy**: JWT-based sessions
- **Duration**: 30 days maximum
- **Storage**: HTTP-only cookies
- **Refresh**: Automatic token refresh



## Database Schema Analysis

The skillEd platform uses a comprehensive relational database schema with the following key models and relationships:

#### Core Models Overview

**1. User Model** - Central entity for all platform users

- **Purpose**: Stores user authentication, profile, and preference data
- **Key Fields**: `id`, `email`, `password`, `firstName`, `lastName`, `username`, `role`
- **Relationships**:
  - One-to-many with `Course` (as instructor)
  - One-to-many with `CourseEnrollment` (as student)
  - One-to-many with `AssignmentSubmission`, `QuizSubmission`, `Achievement`

**2. Course Model** - Educational content container

- **Purpose**: Defines course structure, metadata, and instructor assignment
- **Key Fields**: `courseId`, `title`, `description`, `category`, `difficultyLevel`, `instructorId`
- **Relationships**:
  - Many-to-one with `User` (instructor)
  - One-to-many with `Lesson`, `Assignment`, `Quiz`
  - One-to-many with `CourseEnrollment`
  - Many-to-many with `Course` (prerequisites via `CoursePrerequisite`)

**3. Lesson Model** - Individual learning units within courses

- **Purpose**: Breaks down courses into manageable, ordered learning segments
- **Key Fields**: `lessonId`, `courseId`, `title`, `description`, `order`, `estimatedTime`
- **Relationships**:
  - Many-to-one with `Course`
  - One-to-many with `Assignment`
  - One-to-many with `LessonCompletion`

**4. Assignment Model** - Assessment tasks for students

- **Purpose**: Defines homework, projects, and other graded activities
- **Key Fields**: `assignmentId`, `courseId`, `lessonId`, `title`, `description`, `points`
- **Relationships**:
  - Many-to-one with `Course` and optional `Lesson`
  - One-to-many with `AssignmentSubmission`

**5. AssignmentSubmission Model** - Student work submissions

- **Purpose**: Tracks student submissions, grades, and feedback
- **Key Fields**: `submissionId`, `studentId`, `assignmentId`, `grade`, `feedback`, `status`
- **Relationships**:
  - Many-to-one with `User` (student) and `Assignment`
  - Tracks submission lifecycle: `not_started` → `in_progress` → `submitted` → `graded`

#### Relationship Architecture

**Enrollment Flow**:

```
User (student) → CourseEnrollment → Course → Lesson → LessonCompletion
                                    ↓
                              Assignment → AssignmentSubmission
```

**Prerequisite System**:

```
Course → CoursePrerequisite → Course (prerequisite)
  ↓
CoursePrerequisite → Course (required by)
```

**Progress Tracking**:

```
CourseEnrollment → LessonCompletion (tracks lesson progress)
                → AssignmentSubmission (tracks assignment progress)
                → QuizSubmission (tracks quiz progress)
```

#### Data Integrity Features

1. **Cascade Deletion**: Course deletion removes all related lessons, assignments, and enrollments
2. **Unique Constraints**: Prevents duplicate enrollments and prerequisite relationships
3. **Indexing**: Optimized queries on frequently accessed fields (user IDs, course IDs, status)


#### Schema Limitations & Considerations

1. **Content Storage**: Lesson content not directly stored (consider content management system)
2. **Real-time Updates**: No built-in real-time notification system or user clickstream/session tracking
3. **Analytics**: Analytics require complex aggregation sometimes


## Frontend-Specific Needs Analysis

### Current Implementation Status

#### 1. **Optimistic Updates** - Partially Implemented

- **Assignment Submissions**: `AssignmentDetailPage` updates local state immediately after successful submission
- **Profile Updates**: `ProfileForm` updates form data optimistically after successful API response
- **Learning Preferences**: `LearningPreferences` component updates local state before API call

**Example from AssignmentDetailPage:**

```typescript
// Optimistic update after successful submission
setUserSubmissions((prev) => {
  const updated = [newSubmission, ...prev];
  return updated;
});
```

**Would Ideally Like to Add:**

- No rollback mechanism for failed optimistic updates
- No loading states during optimistic updates
- No conflict resolution for concurrent updates

#### 2. **Error State Communication** - Basic Implementation

- **Consistent Error Response Format**: All APIs return `{ error: string }`
- **HTTP Status Codes**: Proper status codes (400, 401, 404, 500)
- **User Friendly Error Messages**: toasts and frontend form validation

**Example from AssignmentDataProvider:**

```typescript
if (error) {
  return (
    <div className="rounded-lg bg-red-50 p-6 text-center">
      <h3 className="text-lg font-medium text-red-800">
        Error Loading Assignments
      </h3>
      <p className="mt-2 text-red-600">{error}</p>
      <button onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  );
}
```

#### 4. **Pagination/Infinite Scroll** - Basic Implementation

- **Traditional Pagination**: Page-based navigation in explore page
- **Pagination Metadata**: Complete pagination info from APIs
- **URL State Management**: Pagination state in URL parameters

**Example from courses API:**

```typescript
return NextResponse.json({
  data: coursesWithStats,
  pagination: {
    page,
    limit,
    totalCount,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  },
});
```

## Database Schema & API Documentation

### Core Models Overview

#### **User Model** - Central entity for all platform users

**Purpose**: Stores user authentication, profile, and preference data  
**Key Fields**: `id`, `email`, `password`, `firstName`, `lastName`, `username`, `role`  
**Relationships**:

- One-to-many with `Course` (as instructor)
- One-to-many with `CourseEnrollment` (as student)
- One-to-many with `AssignmentSubmission`, `QuizSubmission`, `Achievement`

#### **Course Model** - Educational content container

**Purpose**: Defines course structure, metadata, and instructor assignment  
**Key Fields**: `courseId`, `title`, `description`, `category`, `difficultyLevel`, `instructorId`  
**Relationships**:

- Many-to-one with `User` (instructor)
- One-to-many with `Lesson`, `Assignment`, `Quiz`
- One-to-many with `CourseEnrollment`
- Many-to-many with `Course` (prerequisites via `CoursePrerequisite`)

#### **Lesson Model** - Individual learning units within courses

**Purpose**: Breaks down courses into manageable, ordered learning segments  
**Key Fields**: `lessonId`, `courseId`, `title`, `description`, `order`, `estimatedTime`  
**Relationships**:

- Many-to-one with `Course`
- One-to-many with `Assignment`
- One-to-many with `LessonCompletion`

#### **Assignment Model** - Assessment tasks for students

**Purpose**: Defines homework, projects, and other graded activities  
**Key Fields**: `assignmentId`, `courseId`, `lessonId`, `title`, `description`, `points`  
**Relationships**:

- Many-to-one with `Course` and optional `Lesson`
- One-to-many with `AssignmentSubmission`

#### **AssignmentSubmission Model** - Student work submissions

**Purpose**: Tracks student submissions, grades, and feedback  
**Key Fields**: `submissionId`, `studentId`, `assignmentId`, `grade`, `feedback`, `status`  
**Relationships**:

- Many-to-one with `User` (student) and `Assignment`
- Tracks submission lifecycle: `not_started` → `in_progress` → `submitted` → `graded`

The complete DB schema can be found in the Prisma schema file.

### Relationship Architecture

**Enrollment Flow**:

```
User (student) → CourseEnrollment → Course → Lesson → LessonCompletion
                                    ↓
                              Assignment → AssignmentSubmission
```

**Prerequisite System**:

```
Course → CoursePrerequisite → Course (prerequisite)
  ↓
CoursePrerequisite → Course (required by)
```

**Progress Tracking**:

```
CourseEnrollment → LessonCompletion (tracks lesson progress)
                → AssignmentSubmission (tracks assignment progress)
                → QuizSubmission (tracks quiz progress)
```

### Data Integrity Features

1. **Cascade Deletion**: Course deletion removes all related lessons, assignments, and enrollments
2. **Unique Constraints**: Prevents duplicate enrollments, accounts, prerequisite relationships, etc.
3. **Indexing**: Optimized queries on frequently accessed fields (user IDs, course IDs, status)

### Schema Limitations & Considerations

1. **Content Storage**: Lesson content not directly stored
2. **Real-time Updates**: No built-in real-time notification system
3. **Analytics**: Backend APIs sometimes have to do a lot of complex aggregation

## API Endpoints

We definitely need API endpoints other than just for `/courses` and `/assignments`. Here are some of the most important ones used:

### **AUTHENTICATION & USER MANAGEMENT**

#### **POST /api/users/register** – Register a new user account

**Request Body**:

```json
{
  "email": "student@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "role": "student",
  "preferredStudyTime": "morning"
}
```

**Response**:

```json
{
  "message": "User registered successfully",
  "data": {
    "id": "user_id",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "role": "student",
    "avatarUrl": "https://placekitten.com/200/200",
    "notificationPreference": true,
    "preferredStudyTime": "morning",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "currentStreak": 0
  }
}
```

### **USER PROFILES**

#### **GET /api/users/[userId]/profile** – Get a student's profile with learning statistics and achievements

**Response**:

```json
{
  "id": "user_id",
  "email": "student@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "role": "student",
  "avatarUrl": "https://placekitten.com/200/200",
  "notificationPreference": true,
  "preferredStudyTime": "morning",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLearned": "2024-01-01T00:00:00.000Z",
  "currentStreak": 7,
  "enrollments": [...],
  "achievements": [...],
  "ratings": [...],
  "statistics": {
    "totalCourses": 3,
    "totalLessonsCompleted": 15,
    "totalAchievements": 5,
    "averageRating": 4.5,
    "currentStreak": 7,
    "lastLearned": "2024-01-01T00:00:00.000Z"
  }
}
```

### **COURSES**

#### **GET /api/courses** – List all courses (with filters and pagination)

**Query Parameters**:

- `category` – Filter by course category
- `difficulty` – beginner, intermediate, advanced
- `instructorId` – Filter by instructor
- `search` – Search by title or description
- `page` – Default 1
- `limit` – Default 10

**Response includes**:
`courseId`, `title`, `description`, `thumbnailUrl`, `category`, `difficultyLevel`, `instructor info`, `averageRating`, `totalLessons`, `totalEnrollments`, `totalRatings`

**Pagination**:

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### **POST /api/courses** – Create a new course (instructor only)

**Request Body**:

```json
{
  "title": "string",
  "description": "string",
  "thumbnailUrl": "string",
  "category": "string",
  "difficultyLevel": "string",
  "instructorId": "string"
}
```

### **COURSE CONTENT**

#### **GET /api/courses/[courseId]/assignments** – Get assignments for a course

**Query Parameters**:

- `studentId` (optional – includes submission status)

**Response includes**:

- Course info
- Assignments (`assignmentId`, `title`, `description`, `dueDate`, `points`, `createdAt`, submission details if applicable)
- `totalAssignments`

#### **POST /api/courses/[courseId]/lessons** – Create a new lesson (instructor only)

**Request Body**:

```json
{
  "title": "string",
  "description": "string",
  "order": "number",
  "estimatedTime": "number",
  "instructorId": "string"
}
```

### **ASSIGNMENTS**

#### **POST /api/assignments/submit** – Submit an assignment (student only)

**Request Body**:

```json
{
  "assignmentId": "string",
  "studentId": "string",
  "fileUrl": "string",
  "rubricUrl": "string"
}
```

**Response**:

```json
{
  "message": "Assignment submitted successfully",
  "data": {
    "submissionId": "string",
    "assignmentId": "string",
    "studentId": "string",
    "status": "string",
    "submittedAt": "string",
    "fileUrl": "string",
    "rubricUrl": "string"
  }
}
```

### **ACHIEVEMENTS**

#### **GET /api/achievements/[studentId]** – Get achievements for a student

**Response includes**:

- Student info (`id`, `firstName`, `lastName`, `username`, `currentStreak`)
- Achievements (`achievementId`, `badgeType`, `earnedAt`)
- Statistics (`totalAchievements`, `totalCourses`, `totalLessonsCompleted`)

### **PROFILE**

#### **PUT /api/profile/preferences** - Update learning preferences

**Request Body**:

```json
{
  "userId": "string", // required
  "notificationPreference": "boolean", // optional
  "preferredStudyTime": "string", // optional
  "weeklyLearningGoal": "number" // optional
}
```

**Response**:

```json
{
  "message": "Preferences updated successfully",
  "user": {
    "id": "string",
    "notificationPreference": "boolean",
    "preferredStudyTime": "string",
    "weeklyLearningGoal": "number"
  }
}
```

#### **PUT /api/profile/update** - Update user profile

**Request Body**:

```json
{
  "userId": "string", // required
  "firstName": "string", // optional
  "lastName": "string", // optional
  "email": "string", // optional
  "username": "string", // optional
  "weeklyLearningGoal": "number", // optional
  "currentPassword": "string", // optional
  "newPassword": "string" // optional
}
```

**Response**:

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "username": "string",
    "weeklyLearningGoal": "number",
    "role": "string",
    "avatarUrl": "string",
    "notificationPreference": "boolean",
    "preferredStudyTime": "string",
    "currentStreak": "number",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

## Error Responses

All endpoints return errors in the format:

```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes**:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Data Types

### **Enums**:

- **UserRole**: `student`, `instructor`, `admin`
- **StudyTime**: `morning`, `afternoon`, `evening`, `night`
- **CourseCategory**: `programming`, `design`, `business`, `marketing`, `science`, `language`, `music`, `art`, `other`
- **DifficultyLevel**: `beginner`, `intermediate`, `advanced`
- **SubmissionStatus**: `not_started`, `in_progress`, `submitted`, `graded`
- **BadgeType**: `first_course`, `seven_day_streak`, `high_scorer`, `early_bird`, `perfect_score`, `course_completer`, `streak_master`, `social_learner`

## Authentication and Server Sessions

When considering authentication, I considered two main approaches: storing sessions in the database versus using stateless JWTs.

**Advantages of tracking sessions in the DB**:

- Simpler, more centralized
- Easier to revoke sessions

However, it had a big drawback: every request would require a database lookup, which would slow down the system, especially if the site were scaled.

For this reason, I decided to go with **stateless JWTs for authentication and server sessions**.

**Pros**:

- Eliminates the need for a DB lookup on every request, making the system much more scalable
- Tokens can be verified quickly across multiple servers
- Refresh tokens can still be issued

This was a much simpler approach, but it does have the drawback that learning analytics are much less detailed.

## Real-time Features

Since the platform is mostly for courses, assignments, and progress tracking, I don't think we should add real-time features initially, as they would make it way more complex than needed.

Maybe they'd be needed for real-time notifications, but not for email/push notifications to start out.

Additionally, real-time session tracking or clickstream data would be useful for tracking student sessions to get learning analytics from (how long did a student spend on this lesson/course, how do different methods of learning/interacting with content affect grades). However, I just chose to keep it simple.

## Frontend-specific Needs

**Local state updates are done immediately**. Examples:

- Assignment submissions
- Profile edits
- Lesson completions

**Future improvements**: full optimistic updates

- Rollback mechanism for failed updates
- Error state communication
- Consistent error response format: `{ error: string }`
- Proper HTTP status codes
- User friendly error messages
- Frontend and backend validation
- Basic pagination in API endpoints
- No infinite scroll

## Conclusion

The skillEd platform requires significant backend integration work to support production-scale operations. The current implementation provides a solid foundation but lacks:

1. **Centralized API client** with proper error handling
2. **Real-time capabilities** for live updates
3. **Comprehensive endpoint coverage** for all platform features
4. **Advanced authentication** with security features
5. **Scalability infrastructure** for production deployment

**Immediate Priority**: Implement the core API client layer to standardize all API interactions and provide a foundation for future enhancements.

**Next Steps**:

1. Backend team should review this analysis
2. Prioritize implementation phases based on business requirements
3. Establish API design standards and documentation
4. Implement monitoring and observability from the start
5. Plan for gradual migration from current direct fetch calls to the new API client

This analysis provides the roadmap for transforming skillEd from a development prototype to a production-ready e-learning platform.
