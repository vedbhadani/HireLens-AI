import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';

const SkillGap = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const resumeId = searchParams.get('resumeId');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!jobId || !resumeId) {
      setError('Missing job or resume selection');
      setLoading(false);
      return;
    }

    const fetchGap = async () => {
      try {
        const res = await api.get(`/matches/skill-gap?jobId=${jobId}&resumeId=${resumeId}`);
        setData(res.data?.result || res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load skill gap');
      } finally {
        setLoading(false);
      }
    };
    fetchGap();
  }, [jobId, resumeId]);

  if (loading) return <div className="page-container"><p>Analyzing skill gap...</p></div>;
  if (error) return <div className="page-container"><div className="banner banner-error">{error}</div></div>;
  if (!data) return null;

  const coverage = data.coveragePercent ?? (data.score ?? 0);

  return (
    <div className="page-container" id="skill-gap-page">
      <h1 className="page-title">Skill Gap Analysis</h1>
      <p className="page-subtitle">
        {data.jobTitle || data.jobId?.title || 'Job'} — {data.company || data.jobId?.company || ''}
      </p>

      <div className="coverage-display" id="coverage-display">
        <div className="coverage-value">{Math.round(coverage)}%</div>
        <div className="coverage-label">Skill Coverage</div>
      </div>

      {data.matchedSkills && data.matchedSkills.length > 0 && (
        <div className="skills-section" id="matched-skills-section">
          <div className="skills-section-title" style={{ color: 'var(--color-green)' }}>
            ✓ Matched Skills
          </div>
          <div className="pills-row">
            {data.matchedSkills.map((s, i) => (
              <span className="pill pill-green" key={i}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {data.missingSkills && data.missingSkills.length > 0 && (
        <div className="skills-section" id="missing-skills-section">
          <div className="skills-section-title" style={{ color: 'var(--color-red)' }}>
            ✗ Missing Skills
          </div>
          <div className="pills-row">
            {data.missingSkills.map((s, i) => (
              <span className="pill pill-red" key={i}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGap;