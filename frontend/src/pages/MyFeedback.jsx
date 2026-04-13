import { useState, useEffect } from 'react';
import api from '../api/axios';

const MyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get('/feedback/my');
        setFeedbacks(res.data?.feedbacks || []);
      } catch (err) {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`} style={{ cursor: 'default' }}>
        ★
      </span>
    ));
  };

  if (loading) return <div className="page-container"><p>Loading feedback...</p></div>;

  return (
    <div className="page-container" id="my-feedback-page">
      <h1 className="page-title">My Feedback</h1>

      <div className="card-list">
        {feedbacks.length === 0 && (
          <div className="empty-state">No feedback received yet</div>
        )}
        {feedbacks.map((fb, i) => (
          <div className="card" key={fb._id || i} id={`feedback-card-${i}`}>
            <div className="feedback-job">
              {fb.jobId?.title || 'Job'}
            </div>
            <div className="feedback-from">
              from {fb.recruiterId?.name || 'Recruiter'}
            </div>
            <div className="stars">
              {renderStars(fb.rating || 0)}
            </div>
            {fb.comment && (
              <div className="feedback-comment">"{fb.comment}"</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFeedback;