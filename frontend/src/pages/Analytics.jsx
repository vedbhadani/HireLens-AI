import { useState, useEffect } from 'react';
import api from '../api/axios';

const Analytics = () => {
  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const jobsRes = await api.get('/jobs/my');
        const myJobs = jobsRes.data?.jobs || [];
        setJobs(myJobs);

        // Fetch match and feedback data per job
        const analyticsData = [];
        for (const job of myJobs) {
          try {
            const [matchRes, feedbackRes] = await Promise.allSettled([
              api.get(`/matches/job/${job._id}`),
              api.get(`/feedback/job/${job._id}`),
            ]);

            const matches = matchRes.status === 'fulfilled' ? matchRes.value.data?.results || [] : [];
            const feedbacks = feedbackRes.status === 'fulfilled' ? feedbackRes.value.data?.feedbacks || [] : [];

            const avgRating = feedbacks.length > 0
              ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
              : 'N/A';

            analyticsData.push({
              jobId: job._id,
              title: job.title,
              company: job.company,
              totalMatches: matches.length,
              feedbacksGiven: feedbacks.length,
              avgRating,
            });
          } catch {
            analyticsData.push({
              jobId: job._id,
              title: job.title,
              company: job.company,
              totalMatches: 0,
              feedbacksGiven: 0,
              avgRating: 'N/A',
            });
          }
        }
        setAnalytics(analyticsData);
      } catch (err) {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="page-container"><p>Loading analytics...</p></div>;

  return (
    <div className="page-container" id="analytics-page">
      <h1 className="page-title">Analytics</h1>

      <div className="card-list">
        {analytics.length === 0 && (
          <div className="empty-state">No jobs to analyze yet. Post a job first.</div>
        )}
        {analytics.map((a, i) => (
          <div className="analytics-card" key={a.jobId} id={`analytics-card-${i}`}>
            <div className="job-title" style={{ marginBottom: 'var(--space-md)' }}>
              {a.title}
              {a.company && <span className="text-muted text-sm" style={{ marginLeft: 8 }}>— {a.company}</span>}
            </div>
            <div className="analytics-stat">
              <span className="analytics-stat-label">Total Matches</span>
              <span className="analytics-stat-value">{a.totalMatches}</span>
            </div>
            <div className="analytics-stat">
              <span className="analytics-stat-label">Feedbacks Given</span>
              <span className="analytics-stat-value">{a.feedbacksGiven}</span>
            </div>
            <div className="analytics-stat">
              <span className="analytics-stat-label">Average Rating</span>
              <span className="analytics-stat-value">
                {a.avgRating !== 'N/A' ? `${a.avgRating} ★` : 'N/A'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
