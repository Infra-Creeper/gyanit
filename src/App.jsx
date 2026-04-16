import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/"              element={<Landing />} />
                  <Route path="/courses"        element={<Courses />} />
                  <Route path="/courses/:id"   element={<CourseDetail />} />
                  <Route path="/quiz"           element={
                    <ProtectedRoute>
                      <Quiz />
                    </ProtectedRoute>
                  } />
                  <Route path="/login"          element={<Login />} />
                  <Route path="*"               element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "'Sora', sans-serif",
                fontSize: '14px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
              },
              success: { iconTheme: { primary: '#62bc96', secondary: '#fafcfb' } },
              error:   { iconTheme: { primary: '#c0606a', secondary: '#fafcfb' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
