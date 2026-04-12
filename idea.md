# HireLens AI
## Hiring Intelligence Platform

---

## 1. Project Overview

HireLens AI is a full-stack hiring intelligence platform that helps recruiters make data-driven hiring decisions and helps candidates understand their job competitiveness.

The system parses resumes, extracts skills, matches candidates to job descriptions using a keyword overlap scoring strategy, identifies skill gaps, collects recruiter feedback, and provides analytics.

---

## 2. Problem Statement

Recruitment processes today face several challenges:

- Manual resume screening is time-consuming and inconsistent
- Candidates receive little to no structured feedback after rejection
- Recruiters have no structured view of candidate ranking or skill alignment
- There is no mechanism for hiring systems to improve over time based on outcomes

---

## 3. Proposed Solution

HireLens AI provides:

1. Resume parsing and skill extraction
2. Job description creation with auto skill extraction
3. Candidate-job matching with scored results
4. Skill gap analysis per resume-job combination
5. Recruiter feedback collection with ratings and comments
6. Analytics for recruiters and admins

---

## 4. System Scope

### 4.1 Candidate Module
- Register and login
- Upload resume (PDF)
- View extracted skills from resume
- Browse available job postings
- Trigger match against a job
- View match score with matched and missing skills
- View skill gap analysis with coverage percentage
- View feedback received from recruiters

### 4.2 Recruiter Module
- Register and login
- Create job descriptions with auto skill extraction
- View all posted jobs
- View candidates ranked by match score per job
- Submit star rating and comment feedback per candidate
- View per-job analytics

### 4.3 Admin Module
- View system-wide counts via analytics summary endpoint
- Role exists and is enforced via middleware

---

## 5. Implemented Features

### Authentication & Security
- JWT access tokens with 15 minute expiry
- Refresh token rotation with MongoDB storage and TTL auto-deletion
- bcrypt password hashing
- Role-based access control (candidate / recruiter / admin)
- Helmet security headers
- Rate limiting on auth routes
- Scoped CORS

### Resume Intelligence
- PDF upload with multer (type and size validation)
- Text extraction via pdf-parse
- Keyword-based skill extraction against a dictionary of 50+ tech skills
- Resume stored with extracted skills and parse status

### Job Description Intelligence
- Job creation with title, company, description
- Skill extraction reusing the same `SkillExtractorService`
- Skills auto re-extracted on description update
- Soft delete

### Matching Engine
- `ScoringStrategy` abstract base class
- `KeywordOverlapStrategy` implementation — score = matched skills / total required skills × 100
- `MatchingEngine` class accepts any strategy (Strategy Pattern)
- Match results stored with score, matched skills, missing skills
- Ranked candidates sorted by score descending with populate

### Skill Gap Analyzer
- Returns matched skills, missing skills, coverage percentage per resume-job pair

### Feedback System
- Recruiter submits 1–5 star rating with optional comment per candidate per job
- Duplicate submission guard
- Candidate views all received feedback
- Recruiter revisit shows already-submitted state fetched from DB

### Analytics
- Admin summary: total users, resumes, jobs, matches
- Recruiter job analytics: match count, feedback count, average rating

### Frontend
- Login and register with role selection
- Resume upload with persistent history
- Browse jobs with match trigger and skill gap navigation
- My Matches with score color coding
- Skill gap analysis page
- Create job, My Jobs with delete and view candidates
- Ranked candidates with inline feedback form
- My Feedback with star display

---

## 6. Architecture

**Backend layers:**
- Controllers → HTTP request handling
- Services → Business logic
- Repositories → All DB operations

**Design Patterns:**
- Repository Pattern — full DB abstraction, no Mongoose outside repositories
- Strategy Pattern — `ScoringStrategy` interface, `KeywordOverlapStrategy` implementation, pluggable via `MatchingEngine`

**Security layer:**
- `protect` middleware — JWT verification + deleted-user guard
- `authorize` middleware — role enforcement

---

## 7. Technology Stack

- Frontend: React + Vite, React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Auth: JWT, bcryptjs
- File handling: multer, pdf-parse
- Security: helmet, express-rate-limit, cors

---

## 8. Future Enhancements

The following features were planned in the original system design but are not currently implemented. They are documented here for the next development phase.

### 8.1 Adaptive Scoring Engine
The feedback system currently stores recruiter ratings but does not use them to adjust scoring. The planned system would:
- Track initial match score vs recruiter decision (selected/rejected)
- Identify where the model mispredicted
- Dynamically adjust scoring weights over time
- Maintain a `ModelWeights` collection with version history
- Track precision, recall, and accuracy per model version

This is the most significant planned enhancement and would make the system genuinely self-improving.

### 8.2 Multi-Factor Weighted Matching
The current matching engine uses only skill keyword overlap. The planned formula was:
MatchScore =
0.4 × SkillSimilarity
0.2 × ExperienceMatch
0.2 × ProjectRelevance
0.2 × DomainSimilarity

This requires experience extraction from resume text and project categorization.

### 8.3 Second Scoring Strategy (TF-IDF)
A `TFIDFStrategy` was planned as the second implementation of `ScoringStrategy` to demonstrate the full value of the Strategy Pattern. Currently only `KeywordOverlapStrategy` exists.

### 8.4 Experience and Project Extraction
The Resume model currently stores raw text and extracted skills only. Planned fields include:
- `experienceYears` — extracted via regex from resume text
- `projects` — categorized project list with tech stack detection

### 8.5 Match Explanation
Each `MatchResult` was planned to include a human-readable explanation string such as:
> "Ranked #1 — matched 4 of 5 required skills (react, node.js, mongodb, express). Experience aligns with requirement."

### 8.6 Learning Roadmap Generator
The skill gap endpoint returns missing skills but does not generate a roadmap. The planned enhancement would return:
- Skills prioritized by impact on match score
- Estimated learning timeline per skill
- Suggested resource links per skill

### 8.7 Admin Dashboard (Frontend)
The admin role is implemented and protected on the backend. A frontend dashboard for admins showing system analytics, model performance, and scoring weight management is not yet built.

### 8.8 Embedding-Based Similarity
The current skill extraction is keyword matching. A more robust approach would use text embeddings and cosine similarity to capture contextual relevance — for example matching "React developer" to "frontend engineer" without an exact keyword match.

### 8.9 Market Competitiveness Index
A planned feature to show candidates their percentile ranking among all candidates for a given role type — for example "Top 23% for Junior Backend roles".

### 8.10 Resume Version Comparison
Allow candidates to upload multiple resume versions and compare match score improvements over time to track skill development.
