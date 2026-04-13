import { useState, useEffect } from 'react';
import api from '../api/axios';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes/my');
      setResumes(res.data?.resumes || []);
    } catch (err) {
      // silent
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setError('');
    setSuccess('');
    setUploading(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Resume uploaded and parsed successfully!');
      setFile(null);
      fetchResumes();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-container" id="upload-resume-page">
      <h1 className="page-title">Upload Resume</h1>

      {success && <div className="banner banner-success">{success}</div>}
      {error && <div className="banner banner-error">{error}</div>}

      <form onSubmit={handleUpload} className="upload-zone" id="upload-form">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          id="file-input"
        />
        <button type="submit" className="btn btn-accent" disabled={uploading || !file} id="btn-upload">
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {/* Resume List */}
      <div className="card-list">
        {resumes.length === 0 && (
          <div className="empty-state">No resumes uploaded yet</div>
        )}
        {resumes.map((r, i) => (
          <div className="card" key={r._id || i} id={`resume-card-${i}`}>
            <div className="resume-card-header">
              <span className="resume-filename">{r.originalFilename || r.filename || 'Resume'}</span>
              <span className={`status-badge ${r.status === 'parsed' ? 'status-parsed' : 'status-failed'}`}>
                {r.status || 'uploaded'}
              </span>
            </div>
            {r.skills && r.skills.length > 0 && (
              <div className="pills-row">
                {r.skills.map((skill, j) => (
                  <span className="pill pill-dark" key={j}>{skill}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadResume;