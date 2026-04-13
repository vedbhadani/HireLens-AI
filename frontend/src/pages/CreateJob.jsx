import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreateJob = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExtractedSkills([]);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await api.post('/jobs', { title, company, description });
      setSuccess(true);
      if (res.data?.requiredSkills) {
        setExtractedSkills(res.data.requiredSkills);
      }
      setTitle('');
      setCompany('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" id="create-job-page">
      <h1 className="page-title">Post a Job</h1>

      {success && (
        <div className="banner banner-success">
          Job posted successfully!
          {extractedSkills.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <strong>Extracted skills:</strong>
              <div className="pills-row" style={{ marginTop: 6 }}>
                {extractedSkills.map((skill, i) => (
                  <span className="pill pill-dark" key={i}>{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {error && <div className="banner banner-error">{error}</div>}

      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={handleSubmit} id="create-job-form">
          <div className="form-group">
            <label className="form-label" htmlFor="job-title">Job Title</label>
            <input
              id="job-title"
              className="form-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior React Developer"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="job-company">Company</label>
            <input
              id="job-company"
              className="form-input"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. TechCorp Inc."
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="job-description">Description</label>
            <textarea
              id="job-description"
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and required qualifications..."
              style={{ minHeight: 180 }}
              required
            />
            <p className="form-helper">Skills will be auto-extracted from your description</p>
          </div>
          <button type="submit" className="btn btn-accent" disabled={loading} id="btn-post-job">
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;