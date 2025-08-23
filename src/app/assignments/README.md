# Assignment Tracker

A comprehensive assignment management system for students to track their coursework, deadlines, and progress across all enrolled courses.

## Features

### Assignment Overview Cards

- **Total Assignments**: Shows the total number of assignments across all courses
- **Completed**: Displays completed assignments with a progress bar
- **Overdue**: Highlights assignments that are past their due date
- **Upcoming**: Shows assignments due in the future

### Assignment List with Advanced Features

- **Sortable Columns**:
  - Course name
  - Assignment title
  - Due date
  - Status
  - Points/grade
- **Status Badges**:
  - "Not Started" (gray)
  - "In Progress" (blue)
  - "Submitted" (yellow)
  - "Graded" (green)
- **Due Date Highlighting**:
  - Red for overdue assignments
  - Orange for assignments due today
  - Yellow for assignments due this week
- **Points/Grade Display**: Shows earned points and percentage for completed assignments

### Filtering and Navigation

- Filter by assignment status
- Filter by specific course
- URL-based state management for filters and sorting
- Responsive design for mobile and desktop

## Components

- `AssignmentOverview`: Displays the overview cards with statistics
- `AssignmentList`: Main table with sortable columns and filtering
- `page.tsx`: Main page that fetches data and orchestrates components

## Data Flow

1. Fetches user's course enrollments and assignments
2. Calculates assignment status based on submissions and due dates
3. Applies filters and sorting based on user preferences
4. Renders overview statistics and detailed assignment list

## Navigation

The Assignment Tracker is accessible from the main navigation bar when users are signed in, positioned between Dashboard and Account.
