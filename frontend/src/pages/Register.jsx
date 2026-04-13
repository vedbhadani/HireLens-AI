import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Register = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'candidate';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      login(res.data.user, res.data.accessToken);
      const dest = role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard';
      navigate(dest);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="register-page">
      <div className="auth-card card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join HireLens AI today</p>

        {error && <div className="banner banner-error">{error}</div>}

        <form onSubmit={handleSubmit} id="register-form">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-role">I am a</label>
            <div className="role-toggle" id="role-toggle">
              <button
                type="button"
                className={`role-btn ${role === 'candidate' ? 'role-active' : ''}`}
                onClick={() => setRole('candidate')}
                id="role-candidate"
              >
                Candidate
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'recruiter' ? 'role-active' : ''}`}
                onClick={() => setRole('recruiter')}
                id="role-recruiter"
              >
                Recruiter
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-accent auth-submit" disabled={loading} id="btn-register">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login" className="text-accent">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;