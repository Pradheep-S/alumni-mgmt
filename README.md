# Digital Alumni Connect

A comprehensive web-based platform that manages alumni data and strengthens communication between alumni, students, and institutions. The system enhances engagement through networking, mentorship, and event coordination while maintaining an organized alumni database.

## Features

### Core Functionality
- **Alumni Directory Management**: Browse and search alumni by name, batch, department, or company
- **Role-based Access Control**: Separate access levels for Admin, Alumni, and Students
- **Authentication System**: Secure JWT-based authentication with bcrypt password hashing
- **Responsive Design**: Mobile-first design that works on all devices

### Networking & Communication
- **Mentorship Program**: Alumni can offer mentorship, students can request guidance
- **Advanced Mentorship Features**: 
  - Request mentorship in specific areas (career, technical skills, entrepreneurship, etc.)
  - Schedule meetings and track progress
  - Rating and feedback system
  - Follow-up notes and meeting scheduling

### Event Management
- **Event Creation & Management**: Admin can create and manage alumni events
- **RSVP System**: Users can register for events with capacity management
- **Event Types**: Support for various event types (networking, seminars, workshops, reunions, etc.)
- **Virtual Events**: Support for both in-person and virtual events with meeting links
- **Event Comments**: Users can comment on events for discussion

### User Profiles
- **Comprehensive Profiles**: Include education, current job, bio, LinkedIn profile
- **Mentor Profiles**: Special mentor designation with areas of expertise
- **Profile Pictures**: Support for profile image uploads
- **Privacy Controls**: Users control their profile visibility

### Admin Dashboard
- **User Management**: View, edit, and manage user accounts
- **Event Management**: Create, update, and delete events
- **Analytics Dashboard**: View statistics on users, events, and mentorship
- **System Administration**: Manage platform settings and configurations

## Tech Stack

### Backend
- **Node.js** with **Express.js** - RESTful API server
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** + **bcrypt** - Authentication and password security
- **Express Validator** - Input validation and sanitization
- **Morgan** - HTTP request logging
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** with **Vite** - Modern frontend framework and build tool
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icon library
- **Context API** - State management for authentication

### Development Tools
- **Nodemon** - Development server auto-restart
- **ESLint** - Code linting
- **PostCSS** + **Autoprefixer** - CSS processing

## Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn** package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/alumni-mgmt
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
   JWT_EXPIRE=30d
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

5. **Seed the database with sample data:**
   ```bash
   npm run seed
   ```

6. **Start the backend server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:3000`

## Sample Login Credentials

After seeding the database, you can use these credentials to test the application:

### Admin Account
- **Email:** `admin@alumniconnect.com`
- **Password:** `admin123`
- **Role:** Administrator with full access

### Alumni Account
- **Email:** `sarah.johnson@example.com`
- **Password:** `password123`
- **Role:** Alumni with mentor capabilities

### Student Account
- **Email:** `jessica.brown@example.com`
- **Password:** `password123`
- **Role:** Current student

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Users
- `GET /api/users` - Get all users (with filtering and search)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/mentors` - Get all mentors
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/admin/stats` - Get user statistics (Admin only)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)
- `POST /api/events/:id/rsvp` - RSVP to event
- `DELETE /api/events/:id/rsvp` - Cancel RSVP
- `POST /api/events/:id/comments` - Add comment to event
- `GET /api/events/admin/stats` - Get event statistics (Admin only)

### Mentorship
- `GET /api/mentorship` - Get mentorship requests
- `GET /api/mentorship/:id` - Get mentorship request by ID
- `POST /api/mentorship` - Create mentorship request
- `PUT /api/mentorship/:id/respond` - Respond to mentorship request
- `POST /api/mentorship/:id/notes` - Add follow-up note
- `PUT /api/mentorship/:id/schedule` - Schedule meeting
- `PUT /api/mentorship/:id/complete` - Complete mentorship and add rating
- `GET /api/mentorship/admin/stats` - Get mentorship statistics (Admin only)

## Development Commands

### Backend Commands
```bash
# Install dependencies
npm install

# Start development server with auto-restart
npm run dev

# Start production server
npm start

# Seed database with sample data
npm run seed
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Sample Login Credentials

After seeding the database, you can use these credentials to test the application:

- **Admin:** admin@alumniconnect.com / admin123
- **Alumni:** sarah.johnson@example.com / password123  
- **Student:** jessica.brown@example.com / password123

## License

This project is licensed under the MIT License.

---

Built with ❤️ for the alumni community