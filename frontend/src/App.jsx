import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Candidate pages
import CandidateDashboard from './pages/CandidateDashboard';
import UploadResume from './pages/UploadResume';
import JobsList from './pages/JobsList';
import SkillGap from './pages/SkillGap';
import MyMatches from './pages/MyMatches';
import MyFeedback from './pages/MyFeedback';

// Recruiter pages
import RecruiterDashboard from './pages/RecruiterDashboard';
import CreateJob from './pages/CreateJob';
import MyJobs from './pages/MyJobs';
import RankedCandidates from './pages/RankedCandidates';
import Analytics from './pages/Analytics';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            user
              ? <Navigate to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'} />
              : <LandingPage />
          }
        />
        <Route path="/login" element={
          user ? <Navigate to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'} /> : <Login />
        } />
        <Route path="/register" element={
          user ? <Navigate to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'} /> : <Register />
        } />

        {/* Candidate routes */}
        <Route path="/candidate/dashboard" element={
          <PrivateRoute roles={['candidate']}><CandidateDashboard /></PrivateRoute>
        } />
        <Route path="/candidate/upload-resume" element={
          <PrivateRoute roles={['candidate']}><UploadResume /></PrivateRoute>
        } />
        <Route path="/candidate/jobs" element={
          <PrivateRoute roles={['candidate']}><JobsList /></PrivateRoute>
        } />
        <Route path="/candidate/skill-gap" element={
          <PrivateRoute roles={['candidate']}><SkillGap /></PrivateRoute>
        } />
        <Route path="/candidate/my-matches" element={
          <PrivateRoute roles={['candidate']}><MyMatches /></PrivateRoute>
        } />
        <Route path="/candidate/my-feedback" element={
          <PrivateRoute roles={['candidate']}><MyFeedback /></PrivateRoute>
        } />

        {/* Recruiter routes */}
        <Route path="/recruiter/dashboard" element={
          <PrivateRoute roles={['recruiter']}><RecruiterDashboard /></PrivateRoute>
        } />
        <Route path="/recruiter/post-job" element={
          <PrivateRoute roles={['recruiter']}><CreateJob /></PrivateRoute>
        } />
        <Route path="/recruiter/my-jobs" element={
          <PrivateRoute roles={['recruiter']}><MyJobs /></PrivateRoute>
        } />
        <Route path="/recruiter/ranked-candidates/:jobId" element={
          <PrivateRoute roles={['recruiter']}><RankedCandidates /></PrivateRoute>
        } />
        <Route path="/recruiter/analytics" element={
          <PrivateRoute roles={['recruiter']}><Analytics /></PrivateRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;