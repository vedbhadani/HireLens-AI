# Sequence Diagram – HireLens AI  
## Main Flow: Resume Upload → Matching → Feedback → Skill Gap View

```mermaid
sequenceDiagram

actor Candidate
actor Recruiter

participant Frontend
participant AuthController
participant ResumeController
participant JDController
participant MatchController
participant FeedbackController

participant ResumeService
participant JDService
participant MatchService
participant MatchingEngine
participant SkillExtractorService

participant ResumeRepository
participant JDRepository
participant MatchRepository
participant FeedbackRepository
participant Database


%% =========================
%% 1️⃣ Resume Upload Flow
%% =========================

Candidate ->> Frontend: Upload Resume (PDF)
Frontend ->> ResumeController: POST /resume

ResumeController ->> ResumeService: processResume(file)
ResumeService ->> SkillExtractorService: extractSkills(rawText)
SkillExtractorService -->> ResumeService: extractedSkills

ResumeService ->> SkillExtractorService: normalizeSkills(extractedSkills)
SkillExtractorService -->> ResumeService: normalizedSkills

ResumeService ->> ResumeRepository: save(resume)
ResumeRepository ->> Database: insert resume
Database -->> ResumeRepository: success

ResumeRepository -->> ResumeService: savedResume
ResumeService -->> ResumeController: response
ResumeController -->> Frontend: Resume Uploaded


%% =========================
%% 2️⃣ Job Description Upload
%% =========================

Recruiter ->> Frontend: Upload Job Description
Frontend ->> JDController: POST /job

JDController ->> JDService: processJD(text)
JDService ->> SkillExtractorService: extractSkills(rawText)
SkillExtractorService -->> JDService: extractedSkills

JDService ->> SkillExtractorService: normalizeSkills(extractedSkills)
SkillExtractorService -->> JDService: normalizedSkills

JDService ->> JDRepository: save(job)
JDRepository ->> Database: insert job
Database -->> JDRepository: success

JDRepository -->> JDService: savedJob
JDService -->> JDController: response
JDController -->> Frontend: JD Uploaded


%% =========================
%% 3️⃣ Matching Flow
%% =========================

Recruiter ->> Frontend: View Ranked Candidates
Frontend ->> MatchController: GET /match/:jobId

MatchController ->> MatchService: generateMatches(jobId)

MatchService ->> ResumeRepository: fetchAllResumes()
ResumeRepository ->> Database: query resumes
Database -->> ResumeRepository: resumesList

MatchService ->> MatchingEngine: computeMatchScores(resumes, job)

MatchingEngine ->> MatchingEngine: keywordOverlapScore()
MatchingEngine ->> MatchingEngine: weightedScoreCalculation()

MatchingEngine -->> MatchService: rankedResults

MatchService ->> MatchRepository: save(matchResults)
MatchRepository ->> Database: insert matchResults
Database -->> MatchRepository: success

MatchService -->> MatchController: rankedCandidates
MatchController -->> Frontend: Display Ranked List


%% =========================
%% 4️⃣ Feedback Flow
%% =========================

Recruiter ->> Frontend: Provide Feedback
Frontend ->> FeedbackController: POST /feedback

FeedbackController ->> FeedbackRepository: save(feedback)
FeedbackRepository ->> Database: insert feedback
Database -->> FeedbackRepository: success

FeedbackRepository -->> FeedbackController: savedFeedback
FeedbackController -->> Frontend: Feedback Submitted


%% =========================
%% 5️⃣ Candidate Skill Gap View
%% =========================

Candidate ->> Frontend: View Skill Gap
Frontend ->> MatchController: GET /match/candidate/:resumeId/:jobId

MatchController ->> MatchService: getMatchResult(resumeId, jobId)
MatchService ->> MatchRepository: findByResumeAndJob(resumeId, jobId)
MatchRepository ->> Database: query matchResult
Database -->> MatchRepository: matchResult

MatchRepository -->> MatchService: matchResult
MatchService -->> MatchController: matchResult with missingSkills
MatchController -->> Frontend: Display Skill Gap Analysis
```

---

## Planned Enhancements

> The following flows and features were intentionally excluded from the current implementable scope and are planned for future iterations:

1. **Python AI Microservice** — NLP-based text processing, named entity recognition for skill extraction, embedding vector generation using sentence transformers
2. **Embedding-Based Matching (EmbeddingStrategy)** — Semantic similarity scoring using cosine distance on embedding vectors instead of keyword overlap
3. **MongoDB Atlas Vector Search** — Vector storage and retrieval for resume and JD embeddings
4. **Adaptive Scoring Engine** — Dynamically adjusts scoring weights (skill, experience, project, domain) based on historical recruiter feedback using an Observer pattern
5. **Learning Roadmap Generator** — Generates a prioritized, timeline-based upskilling roadmap with resource suggestions based on identified skill gaps
6. **MODEL_VERSION & MODEL_PERFORMANCE tracking** — Database layer for versioning scoring models and storing precision/recall/accuracy metrics over time
7. **Bias Detection & Fairness Monitoring** — Admin-level monitoring for demographic or skill-group bias in candidate rankings
8. **Multi-Model Ensemble Scoring** — Combining outputs from multiple scoring strategies for more robust match accuracy
9. **AI-Powered Interview Question Generator** — Auto-generates role-specific interview questions based on JD and candidate skill gaps
