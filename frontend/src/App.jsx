import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AlumniDirectory from './pages/AlumniDirectory';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import Mentorship from './pages/Mentorship';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4ade80',
                },
              },
              error: {
                duration: 4000,
                theme: {
                  primary: '#ef4444',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="alumni" element={<AlumniDirectory />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<EventDetails />} />
              <Route path="events/create" element={
                <ProtectedRoute roles={['alumni', 'admin']}>
                  <CreateEvent />
                </ProtectedRoute>
              } />
              <Route path="mentorship" element={<Mentorship />} />
              <Route path="profile" element={<Profile />} />
              
              {/* Admin only routes */}
              <Route path="admin" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Component to handle public routes (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default App;