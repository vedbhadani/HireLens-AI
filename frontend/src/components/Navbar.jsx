import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await api.post('/auth/logout', { refreshToken: token });
    } catch (err) {
      // logout anyway even if request fails
    }
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  // Unauthenticated navbar
  if (!user) {
    return (
      <nav className="navbar" id="navbar-public">
        <Link to="/" className="navbar-brand">HireLens AI</Link>
        <div className="navbar-links">
          <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link to="/register" className="btn btn-accent btn-sm">Register</Link>
        </div>
      </nav>
    );
  }

  // Candidate navbar
  if (user.role === 'candidate') {
    return (
      <nav className="navbar" id="navbar-candidate">
        <Link to="/candidate/dashboard" className="navbar-brand">HireLens AI</Link>
        <div className="navbar-links">
          <Link to="/candidate/dashboard" className={isActive('/candidate/dashboard')}>Dashboard</Link>
          <Link to="/candidate/upload-resume" className={isActive('/candidate/upload-resume')}>Upload Resume</Link>
          <Link to="/candidate/jobs" className={isActive('/candidate/jobs')}>Browse Jobs</Link>
          <Link to="/candidate/my-matches" className={isActive('/candidate/my-matches')}>My Matches</Link>
          <Link to="/candidate/my-feedback" className={isActive('/candidate/my-feedback')}>Feedback</Link>
          <button onClick={handleLogout} className="btn btn-accent btn-sm" id="btn-logout">Logout</button>
        </div>
      </nav>
    );
  }

  // Recruiter navbar
  if (user.role === 'recruiter') {
    return (
      <nav className="navbar" id="navbar-recruiter">
        <Link to="/recruiter/dashboard" className="navbar-brand">HireLens AI</Link>
        <div className="navbar-links">
          <Link to="/recruiter/dashboard" className={isActive('/recruiter/dashboard')}>Dashboard</Link>
          <Link to="/recruiter/post-job" className={isActive('/recruiter/post-job')}>Post Job</Link>
          <Link to="/recruiter/my-jobs" className={isActive('/recruiter/my-jobs')}>My Jobs</Link>
          <Link to="/recruiter/analytics" className={isActive('/recruiter/analytics')}>Analytics</Link>
          <button onClick={handleLogout} className="btn btn-accent btn-sm" id="btn-logout">Logout</button>
        </div>
      </nav>
    );
  }

  return null;
};

export default Navbar;