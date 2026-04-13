import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const RankedCandidates = () => {
  const { jobId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedbackState, setFeedbackState] = useState({});
  // { candidateId: { rating: 0, comment: '', submitted: false, submitting: false } }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchRes, jobRes] = await Promise.allSettled([
          api.get(`/matches/job/${jobId}`),
          api.get(`/jobs/${jobId}`),
        ]);

        if (matchRes.status === 'fulfilled') {
          const sorted = (matchRes.value.data?.results || []).sort((a, b) => b.score - a.score);
          setCandidates(sorted);

          // Initialize feedback state
          const initial = {};
          sorted.forEach((c) => {
            const candidateId = c.candidateId?._id || c.candidateId;
            initial[candidateId] = {
              rating: 0,
              comment: '',
              submitted: !!c.feedbackGiven,
              submitting: false,
            };
          });
          setFeedbackState(initial);
        }

        if (jobRes.status === 'fulfilled') {
          setJobTitle(jobRes.value.data?.job?.title || '');
        }
      } catch (err) {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const getScoreClass = (score) => {
    if (score >= 70) return 'score-green';
    if (score >= 40) return 'score-yellow';
    return 'score-red';
  };

  const handleRating = (candidateId, rating) => {
    setFeedbackState((prev) => ({
      ...prev,
      [candidateId]: { ...prev[candidateId], rating },
    }));
  };

  const handleComment = (candidateId, comment) => {
    setFeedbackState((prev) => ({
      ...prev,
      [candidateId]: { ...prev[candidateId], comment },
    }));
  };

  const handleSubmitFeedback = async (candidateId) => {
    const fb = feedbackState[candidateId];
    if (!fb || fb.rating === 0) return;

    setFeedbackState((prev) => ({
      ...prev,
      [candidateId]: { ...prev[candidateId], submitting: true },
    }));

    try {
      await api.post('/feedback', {
        jobId,
        candidateId,
        rating: fb.rating,
        comment: fb.comment,
      });
      setFeedbackState((prev) => ({
        ...prev,
        [candidateId]: { ...prev[candidateId], submitted: true, submitting: false },
      }));
    } catch (err) {
      setFeedbackState((prev) => ({
        ...prev,
        [candidateId]: { ...prev[candidateId], submitting: false },
      }));
    }
  };

  if (loading) return <div className="page-container"><p>Loading candidates...</p></div>;

  return (
    <div className="page-container" id="ranked-candidates-page">
      <h1 className="page-title">Ranked Candidates</h1>
      {jobTitle && <p className="page-subtitle">{jobTitle}</p>}

      <div className="card-list">
        {candidates.length === 0 && (
          <div className="empty-state">No candidates have matched with this job yet</div>
        )}
        {candidates.map((c, i) => {
          const candidateId = c.candidateId?._id || c.candidateId;
          const candidateName = c.candidateId?.name || 'Candidate';
          const candidateEmail = c.candidateId?.email || '';
          const fb = feedbackState[candidateId] || {};

          return (
            <div className="card" key={candidateId || i} id={`candidate-card-${i}`}>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span className="rank-number">#{i + 1}</span>
                <div className="candidate-info" style={{ flex: 1 }}>
                  <div className="flex-between">
                    <div>
                      <div className="candidate-name">{candidateName}</div>
                      <div className="candidate-email">{candidateEmail}</div>
                    </div>
                    <span className={`score-badge ${getScoreClass(c.score)}`}>
                      {Math.round(c.score)}%
                    </span>
                  </div>

                  {c.matchedSkills && c.matchedSkills.length > 0 && (
                    <div className="match-skills-section">
                      <div className="match-skills-label">Matched:</div>
                      <div className="pills-row">
                        {c.matchedSkills.map((s, j) => (
                          <span className="pill pill-green" key={j}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {c.missingSkills && c.missingSkills.length > 0 && (
                    <div className="match-skills-section">
                      <div className="match-skills-label">Missing:</div>
                      <div className="pills-row">
                        {c.missingSkills.map((s, j) => (
                          <span className="pill pill-red" key={j}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="divider"></div>

                  {fb.submitted ? (
                    <div className="feedback-submitted">✓ Feedback submitted</div>
                  ) : (
                    <div id={`feedback-form-${i}`}>
                      {/* Star rating */}
                      <div className="stars" style={{ marginBottom: 'var(--space-sm)' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star ${star <= (fb.rating || 0) ? 'filled' : ''}`}
                            onClick={() => handleRating(candidateId, star)}
                            id={`star-${i}-${star}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      {/* Comment */}
                      <textarea
                        className="form-textarea"
                        placeholder="Optional comment..."
                        value={fb.comment || ''}
                        onChange={(e) => handleComment(candidateId, e.target.value)}
                        style={{ minHeight: 60, marginBottom: 'var(--space-sm)' }}
                        id={`comment-${i}`}
                      />
                      <button
                        className="btn btn-accent btn-sm"
                        onClick={() => handleSubmitFeedback(candidateId)}
                        disabled={fb.submitting || fb.rating === 0}
                        id={`btn-submit-feedback-${i}`}
                      >
                        {fb.submitting ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RankedCandidates;