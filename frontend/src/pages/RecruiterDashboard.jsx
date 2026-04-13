import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await api.get('/jobs/my');
        const myJobs = jobsRes.data?.jobs || [];
        setJobs(myJobs);

        // Count total matches across all jobs
        let matchCount = 0;
        for (const job of myJobs.slice(0, 10)) {
          try {
            const matchRes = await api.get(`/matches/job/${job._id}/ranked`);
            matchCount += (matchRes.data?.results || []).length;
          } catch {
            // silent
          }
        }
        setTotalMatches(matchCount);
      } catch (err) {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-container" id="recruiter-dashboard">
      <h1 className="dashboard-welcome">Welcome back, {user?.name || 'Recruiter'}</h1>

      <div className="dashboard-summary">
        <div className="summary-card" id="card-jobs-posted">
          <div className="summary-card-title">Jobs Posted</div>
          <div className="summary-card-value">{loading ? '...' : jobs.length}</div>
        </div>
        <div className="summary-card" id="card-total-matches">
          <div className="summary-card-title">Total Matches Received</div>
          <div className="summary-card-value">{loading ? '...' : totalMatches}</div>
        </div>
      </div>

      {/* Recent jobs */}
      {jobs.length > 0 && (
        <div className="card" id="recent-jobs-list">
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--space-md)', color: 'var(--color-dark)' }}>
            Recent Jobs
          </h3>
          {jobs.slice(0, 5).map((job) => (
            <div className="recent-job-item" key={job._id}>
              <div>
                <span style={{ fontWeight: 600 }}>{job.title}</span>
                <span className="text-muted text-sm" style={{ marginLeft: 8 }}>{job.company}</span>
              </div>
              <Link
                to={`/recruiter/ranked-candidates/${job._id}`}
                className="btn btn-accent btn-sm"
                id={`btn-view-candidates-${job._id}`}
              >
                View Candidates
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="quick-actions" style={{ marginTop: 'var(--space-xl)' }}>
        <Link to="/recruiter/post-job" className="btn btn-accent" id="btn-post-job">
          Post a Job
        </Link>
        <Link to="/recruiter/my-jobs" className="btn btn-dark" id="btn-my-jobs">
          View All Jobs
        </Link>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
