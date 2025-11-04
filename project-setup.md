/*
Project: Digital Alumni Connect
Objective:
Develop an interactive and centralized web-based platform that manages alumni data and strengthens communication between alumni, students, and institutions. 
The system enhances engagement through networking, mentorship, and event coordination while maintaining an organized alumni database. It promotes collaboration, career guidance, and continuous institutional growth through a unified digital space.

Tech Stack:
- Frontend: React (Vite), React Router, Axios, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Authentication: JWT + bcrypt
- Deployment Ready: .env support, modular folder structure

Core Features to Implement:
1. **Alumni Directory Management**
   - Alumni can register, log in, and manage their profiles.
   - Admin can view, edit, or delete alumni details.
   - Search and filter alumni by name, batch, or department.

2. **Mentorship & Networking**
   - Alumni can mark themselves as mentors.
   - Students can request mentorship or send messages.
   - Include basic chat or message request feature (optional socket.io or simple REST-based).

3. **Event Management**
   - Admin can post upcoming alumni or college events.
   - Users can view, RSVP, or comment on events.
   - Event details stored in MongoDB with date/time and description.

Additional Functionalities:
- Role-based access (Admin, Alumni, Student)
- Responsive design for mobile and desktop
- Centralized API service in frontend (Axios instance)
- Error handling and validation both frontend & backend
- Proper folder structure for scalability

Suggested Folder Structure:
backend/
 ├── server.js
 ├── config/db.js
 ├── routes/
 ├── controllers/
 ├── models/
 ├── middleware/
 └── utils/

frontend/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── context/
 │   ├── services/
 │   ├── App.jsx
 │   ├── main.jsx
 │   └── index.css
 ├── public/
 └── vite.config.js

Instructions to Copilot:
1. Generate backend boilerplate with Express, Mongoose connection, and routes for users, events, and mentorship.
2. Generate models: User (role-based), Event, and MentorshipRequest.
3. Add authentication with JWT.
4. Create RESTful APIs for CRUD operations on users and events.
5. Scaffold React Vite frontend with routing: Home, Login, Register, Dashboard, Events, Mentorship, and AdminPanel.
6. Connect frontend with backend using Axios.
7. Apply Tailwind CSS for clean, responsive UI.
8. Include state management using Context API for user session and auth tokens.
9. Add protected routes for dashboard and admin access.
10. Ensure code readability, modularization, and include sample data seeding script.

Goal:
Build a fully functional MERN-based “Digital Alumni Connect” platform that allows registration, login, alumni listing, mentorship connection, and event management in an interactive and scalable manner.
*/
