# Todo Application - MERN Stack Assessment

A simple Todo application built with Node.js/Express backend and Next.js frontend running on the same port for MERN stack intern assessment.

## Features

### Backend (Node.js/Express)
- ✅ GET /api/tasks - Fetch all tasks
- ✅ POST /api/tasks - Add new task with validation
- ✅ PUT /api/tasks/:id - Toggle task completion status
- ✅ DELETE /api/tasks/:id - Delete task by ID
- ✅ In-memory data store
- ✅ Basic validation (title required)
- ✅ CORS enabled for frontend integration

### Frontend (Next.js)
- ✅ Modern, responsive UI design
- ✅ Task list with real-time updates
- ✅ Add new task form
- ✅ Toggle task completion (with visual feedback)
- ✅ Delete task functionality
- ✅ Loading states and error handling
- ✅ Mobile-responsive design
- ✅ Completed tasks with strike-through effect

### Performance Optimizations
- ✅ Gzip compression enabled
- ✅ API response caching (5 minutes)
- ✅ Static asset caching (1 year)
- ✅ Optimized bundle size
- ✅ Memoized React components
- ✅ Efficient state management
- ✅ Loading spinners and skeleton states

## Project Structure

```
todo-app/
├── app/
│   ├── globals.css      # Beautiful, responsive styles
│   ├── layout.js        # Next.js root layout
│   └── page.js          # Main todo application
├── server.js            # Express server with Next.js integration
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

## Installation & Setup

### Quick Start

```bash
# Install dependencies
npm install

# Start the application (both backend and frontend)
npm start
```

The application will start on `http://localhost:3000`

### Development Mode

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev
```

## API Endpoints

### Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/tasks` | Get all tasks | - | Array of tasks |
| POST | `/api/tasks` | Create new task | `{title: string, completed?: boolean}` | Created task |
| PUT | `/api/tasks/:id` | Toggle task completion | - | Updated task |
| DELETE | `/api/tasks/:id` | Delete task | - | Success message |

### Example API Usage

```bash
# Get all tasks
curl http://localhost:3000/api/tasks

# Add a new task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Next.js", "completed": false}'

# Toggle task completion
curl -X PUT http://localhost:3000/api/tasks/1

# Delete a task
curl -X DELETE http://localhost:3000/api/tasks/1

# Health check
curl http://localhost:3000/api/health
```

## Testing the Application

### 1. Start the Application

```bash
npm install
npm start
```

### 2. Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

### 3. Test Functionality

1. Open `http://localhost:3000` in your browser
2. Test the following functionality:
   - Add new tasks using the form
   - Toggle task completion by clicking the checkbox or "Complete/Undo" button
   - Delete tasks using the "Delete" button
   - Verify responsive design on mobile devices

### 4. API Testing

1. Test the health endpoint: `http://localhost:3000/api/health`
2. Test API endpoints using curl or Postman
3. Verify all CRUD operations work correctly

## Features Demonstrated

### API Design
- ✅ RESTful endpoint structure with `/api` prefix
- ✅ Proper HTTP status codes
- ✅ Input validation
- ✅ Error handling
- ✅ CORS configuration

### Frontend Integration
- ✅ Real-time API communication using relative URLs
- ✅ State management with React hooks
- ✅ Loading and error states
- ✅ Optimistic UI updates

### UI/UX Design
- ✅ Modern, clean interface
- ✅ Responsive design for all screen sizes
- ✅ Smooth animations and transitions
- ✅ Visual feedback for user actions
- ✅ Accessible design patterns

### Code Quality
- ✅ Clean, readable code structure
- ✅ Proper error handling
- ✅ Comments for complex logic
- ✅ Consistent coding style
- ✅ Separation of concerns

### Single Port Architecture
- ✅ Backend and frontend run on the same port (3000)
- ✅ Express serves Next.js frontend
- ✅ API routes under `/api` prefix
- ✅ Simplified deployment and development

## Available Scripts

```bash
npm install          # Install dependencies
npm start           # Start production server
npm run dev         # Start development server
npm run build       # Build for production
npm run lint        # Run ESLint
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Check if port 3000 is available
   - Kill any existing processes on port 3000
   - Use a different port by setting `PORT` environment variable

2. **Dependencies not installed**
   - Run `npm install` to install all dependencies
   - Check Node.js version compatibility

3. **Build errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Build for production
npm run build
```

## Evaluation Criteria Met

- ✅ **API Design**: Proper endpoint structure, validation, and functionality
- ✅ **Frontend Integration**: Smooth interaction between UI and API
- ✅ **HTML/CSS Skills**: Clean and responsive design
- ✅ **Code Quality**: Readable and maintainable code with comments
- ✅ **Single Port Architecture**: Backend and frontend running together

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: Next.js, React, CSS3
- **Data Store**: In-memory array (for simplicity)
- **Styling**: Custom CSS with responsive design
- **Architecture**: Single port with Express serving Next.js

---

**Note**: This application uses in-memory storage for simplicity. In a production environment, you would want to use a proper database like MongoDB, PostgreSQL, or similar. 