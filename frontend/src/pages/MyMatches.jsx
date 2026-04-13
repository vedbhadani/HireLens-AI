import { useState, useEffect } from 'react';
import api from '../api/axios';

const MyMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get('/matches/my');
        const sorted = (res.data?.results || []).sort((a, b) => b.score - a.score);
        setMatches(sorted);
      } catch (err) {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const getScoreClass = (score) => {
    if (score >= 70) return 'score-green';
    if (score >= 40) return 'score-yellow';
    return 'score-red';
  };

  if (loading) return <div className="page-container"><p>Loading matches...</p></div>;

  return (
    <div className="page-container" id="my-matches-page">
      <h1 className="page-title">My Matches</h1>

      <div className="card-list">
        {matches.length === 0 && (
          <div className="empty-state">No matches yet. Browse jobs and click "Match Me" to get started.</div>
        )}
        {matches.map((m, i) => (
          <div className="card" key={m._id || i} id={`match-card-${i}`}>
            <div className="match-card-top">
              <div>
                <div className="job-title">{m.jobId?.title || 'Job'}</div>
                <div className="job-company">{m.jobId?.company || ''}</div>
              </div>
              <span className={`score-badge ${getScoreClass(m.score)}`}>
                {Math.round(m.score)}%
              </span>
            </div>

            {m.matchedSkills && m.matchedSkills.length > 0 && (
              <div className="match-skills-section">
                <div className="match-skills-label">Matched:</div>
                <div className="pills-row">
                  {m.matchedSkills.map((s, j) => (
                    <span className="pill pill-green" key={j}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {m.missingSkills && m.missingSkills.length > 0 && (
              <div className="match-skills-section">
                <div className="match-skills-label">Missing:</div>
                <div className="pills-row">
                  {m.missingSkills.map((s, j) => (
                    <span className="pill pill-red" key={j}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyMatches;