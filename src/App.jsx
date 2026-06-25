import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseDetails from './pages/CourseDetails';
import MyCourses from './pages/MyCourses';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourseDetails from './pages/AdminCourseDetails';
import AdminCourseAnalytics from './pages/AdminCourseAnalytics';
import LiveClassRoom from './pages/LiveClassRoom';
import ApplyInternship from './pages/ApplyInternship';
import MyApplication from './pages/MyApplication';
import AdminInternships from './pages/AdminInternships';
import AdminTasks from './pages/AdminTasks';

const ConditionalNavbar = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/live/')) return null;
  return <Navbar />;
};

const ConditionalFooter = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/live/')) return null;
  return <Footer />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div
          className="min-h-screen flex flex-col font-sans antialiased"
          style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
          <ConditionalNavbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/course/:id" element={<CourseDetails />} />

              {/* Protected Student Routes */}
              <Route
                path="/my-courses"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <MyCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/apply-internship"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <ApplyInternship />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-application"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <MyApplication />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/course/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminCourseDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/course/:id/analytics"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminCourseAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/internships"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminInternships />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tasks"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminTasks />
                  </ProtectedRoute>
                }
              />

              {/* Shared Protected Route for Live Class */}
              <Route
                path="/live/:courseId/:chapterId/:liveClassId"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <LiveClassRoom />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <ConditionalFooter />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
