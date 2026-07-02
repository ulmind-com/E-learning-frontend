import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
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
import AdminCourseStudents from './pages/AdminCourseStudents';
import AdminTaskDetails from './pages/AdminTaskDetails';
import Internships from './pages/Internships';
import InternshipDetails from './pages/InternshipDetails';
import AdminInternshipUpload from './pages/AdminInternshipUpload';
import Settings from './pages/Settings';
import SheryiansBg from './components/SheryiansBg';

const ConditionalNavbar = () => {
  const location = useLocation();
  const hiddenRoutes = ['/login', '/register', '/forgot-password'];
  
  if (location.pathname.startsWith('/live/') || hiddenRoutes.includes(location.pathname)) {
    return null;
  }
  
  return (
    <>
      <Navbar />
      <div className="h-[110px] w-full shrink-0"></div>
    </>
  );
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
          className="min-h-screen flex flex-col font-sans antialiased relative"
          style={{ color: 'var(--text-primary)', backgroundColor: '#050505' }}
        >

          <div className="relative z-10 flex flex-col min-h-screen">
            <ConditionalNavbar />
            <main className="flex-grow">
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/internships" element={<Internships />} />
              <Route path="/internship/:id" element={<InternshipDetails />} />

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
                path="/apply-internship/:id"
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
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <Settings />
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
                path="/admin/course/:id/students"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminCourseStudents />
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
                path="/admin/internships-manage"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminInternshipUpload />
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
              <Route
                path="/admin/task/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminTaskDetails />
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
