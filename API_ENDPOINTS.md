# E-Learning Platform API Endpoints

## Authentication & User Management

### POST /api/users/register

Register a new user account.

**Request Body:**

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

**Response:**

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

## User Profiles

### GET /api/users/[userId]/profile

Get a student's profile with learning statistics and achievements.

**Response:**

```json
{
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
}
```

## Courses

### GET /api/courses

List all courses with filtering and pagination.

**Query Parameters:**

- `category`: Filter by course category (programming, design, business, etc.)
- `difficulty`: Filter by difficulty level (beginner, intermediate, advanced)
- `instructorId`: Filter by specific instructor
- `search`: Search in title and description
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**

```json
{
  "data": [
    {
      "courseId": "course_id",
      "title": "JavaScript Fundamentals",
      "description": "Learn JavaScript from scratch",
      "thumbnailUrl": "https://placekitten.com/400/300",
      "category": "programming",
      "difficultyLevel": "beginner",
      "instructorId": "instructor_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "instructor": {
        "id": "instructor_id",
        "firstName": "Sarah",
        "lastName": "Johnson",
        "username": "sarah_johnson",
        "avatarUrl": "https://placekitten.com/200/200"
      },
      "averageRating": 4.5,
      "totalLessons": 10,
      "totalEnrollments": 25,
      "totalRatings": 8
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### POST /api/courses

Create a new course (instructor only).

**Request Body:**

```json
{
  "title": "Advanced React Development",
  "description": "Master React hooks and advanced patterns",
  "thumbnailUrl": "https://placekitten.com/400/301",
  "category": "programming",
  "difficultyLevel": "intermediate",
  "instructorId": "instructor_id"
}
```

## Course Content

### GET /api/courses/[courseId]/assignments

Get assignments for a specific course.

**Query Parameters:**

- `studentId`: Optional - include student's submission status

**Response:**

```json
{
  "data": {
    "course": {
      "courseId": "course_id",
      "title": "JavaScript Fundamentals"
    },
    "assignments": [
      {
        "assignmentId": "assignment_id",
        "title": "JavaScript Calculator",
        "description": "Build a simple calculator",
        "dueDate": "2024-01-15T00:00:00.000Z",
        "points": 100,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "submission": {
          "status": "submitted",
          "submittedAt": "2024-01-10T00:00:00.000Z",
          "grade": 95,
          "feedback": "Excellent work!"
        }
      }
    ],
    "totalAssignments": 3
  }
}
```

### POST /api/courses/[courseId]/lessons

Create a new lesson in a course (instructor only).

**Request Body:**

```json
{
  "title": "Introduction to JavaScript",
  "description": "What is JavaScript and why is it important?",
  "order": 1,
  "estimatedTime": 30,
  "instructorId": "instructor_id"
}
```

## Assignments

### POST /api/assignments/submit

Submit an assignment (student only).

**Request Body:**

```json
{
  "assignmentId": "assignment_id",
  "studentId": "student_id",
  "fileUrl": "https://example.com/file.pdf",
  "rubricUrl": "https://example.com/rubric.pdf"
}
```

**Response:**

```json
{
  "message": "Assignment submitted successfully",
  "data": {
    "submissionId": "submission_id",
    "assignmentId": "assignment_id",
    "studentId": "student_id",
    "status": "submitted",
    "submittedAt": "2024-01-10T00:00:00.000Z",
    "fileUrl": "https://example.com/file.pdf",
    "rubricUrl": "https://example.com/rubric.pdf"
  }
}
```

## Achievements

### GET /api/achievements/[studentId]

Get achievements for a specific student.

**Response:**

```json
{
  "data": {
    "student": {
      "id": "student_id",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "currentStreak": 7
    },
    "achievements": [
      {
        "achievementId": "achievement_id",
        "badgeType": "first_course",
        "earnedAt": "2024-01-01T00:00:00.000Z"
      },
      {
        "achievementId": "achievement_id_2",
        "badgeType": "seven_day_streak",
        "earnedAt": "2024-01-07T00:00:00.000Z"
      }
    ],
    "statistics": {
      "totalAchievements": 2,
      "totalCourses": 3,
      "totalLessonsCompleted": 15
    }
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Data Types

### Enums

**UserRole:** `student`, `instructor`, `admin`
**StudyTime:** `morning`, `afternoon`, `evening`, `night`
**CourseCategory:** `programming`, `design`, `business`, `marketing`, `science`, `language`, `music`, `art`, `other`
**DifficultyLevel:** `beginner`, `intermediate`, `advanced`
**SubmissionStatus:** `not_started`, `in_progress`, `submitted`, `graded`
**BadgeType:** `first_course`, `seven_day_streak`, `high_scorer`, `early_bird`, `perfect_score`, `course_completer`, `streak_master`, `social_learner`

## Notes

- All timestamps are in ISO 8601 format
- File uploads are handled via URLs (implement file storage separately)
- Authentication middleware should be added for production use
- Rate limiting should be implemented for production use
- Input validation uses the types defined in `src/types/index.ts`

