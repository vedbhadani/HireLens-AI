import { Link } from 'react-router-dom';
import './LandingPage.css';

const features = [
  {
    icon: '⚡',
    title: 'Skill Extraction',
    desc: 'Auto-extracts 50+ tech skills from your PDF resume',
  },
  {
    icon: '📊',
    title: 'Match Scoring',
    desc: 'Get a percentage score showing your fit for any job',
  },
  {
    icon: '🔍',
    title: 'Skill Gap Analysis',
    desc: 'See exactly which skills you need to land the role',
  },
  {
    icon: '🏆',
    title: 'Ranked Candidates',
    desc: 'Recruiters see candidates sorted by match score',
  },
  {
    icon: '💬',
    title: 'Feedback System',
    desc: 'Structured recruiter feedback with ratings and comments',
  },
];

const LandingPage = () => {
  return (
    <div className="landing" id="landing-page">
      {/* Hero */}
      <section className="landing-hero" id="hero-section">
        <h1 className="hero-headline">Smart Hiring. Data-Driven Decisions.</h1>
        <p className="hero-subheading">
          Match candidates to jobs using AI-powered skill analysis
        </p>
        <div className="hero-ctas">
          <Link to="/register?role=candidate" className="btn btn-accent btn-lg" id="cta-candidate">
            I'm a Candidate
          </Link>
          <Link to="/register?role=recruiter" className="btn btn-dark btn-lg" id="cta-recruiter">
            I'm a Recruiter
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-section" id="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="how-grid">
          <div className="how-column">
            <h3 className="how-heading">For Candidates</h3>
            <div className="how-steps">
              <div className="how-step">
                <span className="step-number">1</span>
                <p>Upload your resume PDF</p>
              </div>
              <div className="how-step">
                <span className="step-number">2</span>
                <p>Browse available job postings</p>
              </div>
              <div className="how-step">
                <span className="step-number">3</span>
                <p>See your match score and skill gaps</p>
              </div>
            </div>
          </div>
          <div className="how-column">
            <h3 className="how-heading">For Recruiters</h3>
            <div className="how-steps">
              <div className="how-step">
                <span className="step-number">1</span>
                <p>Post a job description</p>
              </div>
              <div className="how-step">
                <span className="step-number">2</span>
                <p>View candidates ranked by match score</p>
              </div>
              <div className="how-step">
                <span className="step-number">3</span>
                <p>Submit feedback on candidates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-section" id="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card card" key={i} id={`feature-${i}`}>
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar" id="stats-section">
        <div className="stats-inner">
          <div className="stat-item">
            <span className="stat-value">50+</span>
            <span className="stat-label">Skills Tracked</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">⚡</span>
            <span className="stat-label">Real-time Matching</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">🔒</span>
            <span className="stat-label">Role-based Access</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta" id="cta-section">
        <h2 className="cta-heading">Ready to get started?</h2>
        <Link to="/register" className="btn btn-accent btn-lg" id="cta-register">
          Register Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer" id="footer">
        <p>HireLens AI © 2026</p>
      </footer>
    </div>
  );
};

export default LandingPage;
