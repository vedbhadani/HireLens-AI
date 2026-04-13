import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/my');
      setJobs(res.data?.jobs || []);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      // silent
    }
  };

  if (loading) return <div className="page-container"><p>Loading jobs...</p></div>;

  return (
    <div className="page-container" id="my-jobs-page">
      <div className="flex-between" style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>My Jobs</h1>
        <Link to="/recruiter/post-job" className="btn btn-accent btn-sm" id="btn-add-job">
          + Post Job
        </Link>
      </div>

      <div className="card-list">
        {jobs.length === 0 && (
          <div className="empty-state">No jobs posted yet</div>
        )}
        {jobs.map((job) => (
          <div className="card" key={job._id} id={`myjob-card-${job._id}`}>
            <div className="job-card-header">
              <div className="job-title">{job.title}</div>
              <div className="job-company">{job.company}</div>
            </div>

            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div className="pills-row">
                {job.requiredSkills.map((skill, i) => (
                  <span className="pill pill-gray" key={i}>{skill}</span>
                ))}
              </div>
            )}

            <div className="card-actions">
              <Link
                to={`/recruiter/ranked-candidates/${job._id}`}
                className="btn btn-accent btn-sm"
                id={`btn-candidates-${job._id}`}
              >
                View Candidates
              </Link>
              <button
                className="btn btn-dark btn-sm"
                onClick={() => handleDelete(job._id)}
                id={`btn-delete-${job._id}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyJobs;