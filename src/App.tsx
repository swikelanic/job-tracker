import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';  
import JobDetailsPage from './pages/JobDetailsPage';
import JobEditPage from './pages/JobEditPage';  // <-- Import JobEditPage here
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import JobsListPage from './pages/JobsListPage';
import AddJobPage from './pages/AddJobPage';
import JobsAppliedPage from './pages/JobsAppliedPage';  // <- Import it here

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/add"
          element={
            <ProtectedRoute>
              <AddJobPage />
            </ProtectedRoute>
          }
        />
        {/* Added route for /jobs/new */}
        <Route
          path="/jobs/new"
          element={
            <ProtectedRoute>
              <AddJobPage />
            </ProtectedRoute>
          }
        />
        {/* Added route for /jobs/applied */}
        <Route
          path="/jobs/applied"
          element={
            <ProtectedRoute>
              <JobsAppliedPage />
            </ProtectedRoute>
          }
        />
        {/* New route for editing a job */}
        <Route
          path="/jobs/:id/edit"
          element={
            <ProtectedRoute>
              <JobEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
