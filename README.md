# HireLens AI
### Hiring Intelligence Platform

A full-stack MERN application that helps recruiters rank candidates against job descriptions and helps candidates understand their skill fit and gaps.

---

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (access + refresh tokens)
- bcryptjs, helmet, express-rate-limit, multer, pdf-parse

**Frontend**
- React + Vite
- React Router DOM
- Axios

---

## Architecture

The backend follows a strict three-layer architecture:
- **Controllers** — HTTP only. Validate input, call service, return JSON.
- **Services** — All business logic. No Mongoose imports.
- **Repositories** — All DB queries. Only layer that touches Mongoose models.

Design patterns implemented:
- **Repository Pattern** — DB abstraction across all modules
- **Strategy Pattern** — `ScoringStrategy` base class with `KeywordOverlapStrategy` implementation, pluggable via `MatchingEngine`

---

## Project Structure

```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── AuthController.js
│   ├── ResumeController.js
│   ├── JobController.js
│   ├── MatchController.js
│   ├── SkillGapController.js
│   ├── FeedbackController.js
│   └── AnalyticsController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── uploadMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── User.js
│   ├── RefreshToken.js
│   ├── Resume.js
│   ├── JobDescription.js
│   ├── MatchResult.js
│   └── Feedback.js
├── repositories/
│   ├── AuthRepository.js
│   ├── ResumeRepository.js
│   ├── JobRepository.js
│   ├── MatchRepository.js
│   └── FeedbackRepository.js
├── routes/
│   ├── authRoutes.js
│   ├── resumeRoutes.js
│   ├── jobRoutes.js
│   ├── matchRoutes.js
│   ├── skillGapRoutes.js
│   ├── feedbackRoutes.js
│   └── analyticsRoutes.js
├── services/
│   ├── AuthService.js
│   ├── ResumeService.js
│   ├── JobService.js
│   ├── MatchService.js
│   ├── SkillGapService.js
│   ├── FeedbackService.js
│   ├── AnalyticsService.js
│   ├── SkillExtractorService.js
│   ├── MatchingEngine.js
│   └── strategies/
│       ├── ScoringStrategy.js
│       └── KeywordOverlapStrategy.js
├── .env.example
└── server.js

frontend/
├── src/
│   ├── api/
│   │   └── axios.js
│   ├── components/
│   │   └── Navbar.jsx
│   ├── context/
│   │   └── AuthContext.js
│   └── pages/
│       ├── Login.jsx
│       ├── Register.jsx
│       ├── UploadResume.jsx
│       ├── JobsList.jsx
│       ├── SkillGap.jsx
│       ├── MyMatches.jsx
│       ├── MyFeedback.jsx
│       ├── CreateJob.jsx
│       ├── MyJobs.jsx
│       └── RankedCandidates.jsx
```

---

## Modules

### Auth
- Register and login with role selection (candidate / recruiter / admin)
- JWT access tokens (15 min expiry)
- Refresh token rotation — old token revoked on every refresh, new pair issued
- MongoDB TTL index auto-deletes expired refresh tokens
- `protect` middleware verifies token and handles deleted-user edge case
- `authorize` middleware for role-based route guarding
- Rate limiting — 20 requests per 15 minutes on all auth routes
- Helmet security headers, scoped CORS

### Resume Module (Candidate)
- PDF upload via multer (5MB limit, PDF only)
- Text extraction using pdf-parse
- Keyword-based skill extraction against a dictionary of 50+ tech skills
- Resume stored with extracted skills and parse status
- All uploaded resumes persist and display on revisit

### Job Description Module (Recruiter)
- Create job postings with title, company, description
- `SkillExtractorService` reused to auto-extract required skills from description
- Skills re-extracted automatically if description is updated
- Soft delete — deleted jobs hidden from listings but not removed from DB
- Recruiters see only their own jobs

### Matching Engine
- Candidate triggers match between their resume and a job
- `KeywordOverlapStrategy` computes score as percentage of job skills found in resume
- Returns score (0–100), matched skills, missing skills
- Result stored in DB — re-matching updates existing record, no duplicates
- Recruiter sees candidates ranked by score descending, with populated name and email

### Skill Gap Analyzer
- Candidate selects a resume + job combination
- Returns matched skills, missing skills, coverage percentage
- Accessible from Browse Jobs page via Skill Gap button

### Feedback System
- Recruiter views ranked candidates per job
- Star rating (1–5) + optional comment per candidate
- One feedback per recruiter per candidate per job (duplicate guard)
- On revisit, already-rated candidates show submitted state (fetched from DB)
- Candidate sees all received feedback with rating and recruiter name

### Analytics
- Admin: total counts — candidates, recruiters, resumes, jobs, matches
- Recruiter: per-job analytics — total matches, total feedbacks, average rating

---

## API Endpoints

### Auth
POST   /api/auth/register  
POST   /api/auth/login  
POST   /api/auth/refresh  
POST   /api/auth/logout  
GET    /api/auth/me  

### Resumes
POST   /api/resumes/upload        (candidate only)  
GET    /api/resumes/me  
GET    /api/resumes/:id  
DELETE /api/resumes/:id  

### Jobs
POST   /api/jobs                  (recruiter only)  
GET    /api/jobs  
GET    /api/jobs/my               (recruiter only)  
GET    /api/jobs/:id  
PUT    /api/jobs/:id              (recruiter only)  
DELETE /api/jobs/:id              (recruiter only)  

### Matching
POST   /api/matches               (candidate only)  
GET    /api/matches/me            (candidate only)  
GET    /api/matches/job/:jobId/ranked  (recruiter only)  

### Skill Gap
GET    /api/skill-gap/analyze?resumeId=&jobId=   (candidate only)  

### Feedback
POST   /api/feedback              (recruiter only)  
GET    /api/feedback/me           (candidate only)  
GET    /api/feedback/job/:jobId   (recruiter only)  

### Analytics
GET    /api/analytics/summary     (admin only)  
GET    /api/analytics/jobs/:jobId (recruiter only)  

---

## Setup

**Backend**
```bash
cd backend
npm install
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Environment Variables**
```
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=15m
CLIENT_URL=http://localhost:5173
```

---

## Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT secret never exposed — stored in environment variables
- `password` field stripped from all API responses via `toJSON` override
- Helmet sets XSS, clickjacking, MIME sniffing headers
- Rate limiting on auth routes prevents brute force
- File upload restricted to PDF, max 5MB
- CORS scoped to `CLIENT_URL` environment variable
- Refresh token revocation on logout and rotation on refresh
