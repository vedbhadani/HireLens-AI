import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeRes, matchesRes] = await Promise.allSettled([
          api.get('/resumes/me'),
          api.get('/matches/my'),
        ]);

        if (resumeRes.status === 'fulfilled' && resumeRes.value.data?.resumes?.length > 0) {
          const resumesArray = resumeRes.value.data.resumes;
          setResume(resumesArray[resumesArray.length - 1]);
        }
        if (matchesRes.status === 'fulfilled') {
          setRecentMatches((matchesRes.value.data?.results || []).slice(0, 3));
        }
      } catch (err) {
        // silently fail for dashboard preview
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getScoreClass = (score) => {
    if (score >= 70) return 'score-green';
    if (score >= 40) return 'score-yellow';
    return 'score-red';
  };

  return (
    <div className="page-container" id="candidate-dashboard">
      <h1 className="dashboard-welcome">Welcome back, {user?.name || 'Candidate'}</h1>

      <div className="dashboard-summary">
        {/* My Resume Card */}
        <div className="summary-card" id="card-my-resume">
          <div className="summary-card-title">My Resume</div>
          {loading ? (
            <p className="text-muted text-sm">Loading...</p>
          ) : resume ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p className="resume-filename" style={{ fontSize: '18px', margin: 0 }}>
                  {resume.originalFilename || resume.filename || 'Resume'}
                </p>
                <span className={`status-badge ${resume.status === 'parsed' ? 'status-parsed' : 'status-failed'}`}>
                  {resume.status || 'uploaded'}
                </span>
              </div>
              {resume.skills && (
                <p className="text-sm text-secondary" style={{ margin: 0 }}>
                  ✓ {resume.skills.length} skills automatically extracted
                </p>
              )}
            </>
          ) : (
            <p className="text-muted text-sm">No resume uploaded yet</p>
          )}
        </div>

        {/* Recent Matches Card */}
        <div className="summary-card" id="card-recent-matches">
          <div className="summary-card-title">Recent Matches</div>
          {loading ? (
            <p className="text-muted text-sm">Loading...</p>
          ) : recentMatches.length > 0 ? (
            recentMatches.map((m, i) => (
              <div className="recent-match-item" key={i}>
                <span>{m.jobId?.title || 'Job'}</span>
                <span className={`score-badge ${getScoreClass(m.score)}`}>
                  {Math.round(m.score)}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted text-sm">No matches yet</p>
          )}
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/candidate/upload-resume" className="btn btn-accent" id="btn-upload-resume">
          Upload Resume
        </Link>
        <Link to="/candidate/jobs" className="btn btn-dark" id="btn-browse-jobs">
          Browse Jobs
        </Link>
      </div>
    </div>
  );
};

export default CandidateDashboard;
