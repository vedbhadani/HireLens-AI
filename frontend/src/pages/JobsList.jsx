import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [matchResults, setMatchResults] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, resumesRes] = await Promise.all([
          api.get('/jobs'),
          api.get('/resumes/my'),
        ]);
        setJobs(jobsRes.data?.jobs || []);
        const myResumes = resumesRes.data?.resumes || [];
        setResumes(myResumes);
        if (myResumes.length > 0) {
          setSelectedResume(myResumes[myResumes.length - 1]._id);
        }
      } catch (err) {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMatch = async (jobId) => {
    if (!selectedResume) return;
    try {
      const res = await api.post('/matches/match', {
        resumeId: selectedResume,
        jobId,
      });
      setMatchResults((prev) => ({ ...prev, [jobId]: res.data?.result || res.data }));
    } catch (err) {
      // silent
    }
  };

  const handleSkillGap = (jobId) => {
    if (!selectedResume) return;
    navigate(`/candidate/skill-gap?jobId=${jobId}&resumeId=${selectedResume}`);
  };

  const getScoreClass = (score) => {
    if (score >= 70) return 'score-green';
    if (score >= 40) return 'score-yellow';
    return 'score-red';
  };

  if (loading) return <div className="page-container"><p>Loading jobs...</p></div>;

  return (
    <div className="page-container" id="jobs-list-page">
      <h1 className="page-title">Available Jobs</h1>

      {resumes.length > 0 && (
        <div className="form-group" style={{ maxWidth: 400, marginBottom: 24 }}>
          <label className="form-label" htmlFor="resume-select">Match with resume:</label>
          <select
            id="resume-select"
            className="form-select"
            value={selectedResume}
            onChange={(e) => setSelectedResume(e.target.value)}
          >
            {resumes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.originalFilename || r.filename || 'Resume'}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="card-list">
        {jobs.length === 0 && <div className="empty-state">No jobs available</div>}
        {jobs.map((job) => (
          <div className="card" key={job._id} id={`job-card-${job._id}`}>
            {/* Match result banner */}
            {matchResults[job._id] && (
              <div className="banner banner-success" style={{ marginBottom: 16 }}>
                <strong>Score: {Math.round(matchResults[job._id].score)}%</strong>
                {matchResults[job._id].matchedSkills?.length > 0 && (
                  <span> · Matched: {matchResults[job._id].matchedSkills.join(', ')}</span>
                )}
                {matchResults[job._id].missingSkills?.length > 0 && (
                  <span> · Missing: {matchResults[job._id].missingSkills.join(', ')}</span>
                )}
              </div>
            )}

            <div className="job-card-header">
              <div className="job-title">{job.title}</div>
              <div className="job-company">{job.company}</div>
            </div>

            {job.description && (
              <p className="job-desc truncate-2">{job.description}</p>
            )}

            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div className="pills-row">
                {job.requiredSkills.map((skill, i) => (
                  <span className="pill pill-gray" key={i}>{skill}</span>
                ))}
              </div>
            )}

            <div className="card-actions">
              <button
                className="btn btn-accent btn-sm"
                onClick={() => handleMatch(job._id)}
                disabled={!selectedResume}
                id={`btn-match-${job._id}`}
              >
                Match Me
              </button>
              <button
                className="btn btn-dark btn-sm"
                onClick={() => handleSkillGap(job._id)}
                disabled={!selectedResume}
                id={`btn-gap-${job._id}`}
              >
                Skill Gap
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsList;