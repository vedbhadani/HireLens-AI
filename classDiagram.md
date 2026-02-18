# Class Diagram – HireLens AI

```mermaid
classDiagram

%% ========================
%% Base User Class
%% ========================

class User {
  -id: String
  -name: String
  -email: String
  -passwordHash: String
  -role: String
  +register()
  +login()
  +logout()
}

class Candidate {
  +uploadResume()
  +viewMatchScores()
  +viewSkillGap()
}

class Recruiter {
  +uploadJobDescription()
  +viewRankedCandidates()
  +provideFeedback()
}

class Admin {
  +viewSystemAnalytics()
  +viewFeedbackTrends()
}

User <|-- Candidate
User <|-- Recruiter
User <|-- Admin


%% ========================
%% Core Domain Classes
%% ========================

class Resume {
  -id: String
  -candidateId: String
  -skills: List
  -experienceYears: Number
  -projects: List
  +parseResume()
}

class JobDescription {
  -id: String
  -recruiterId: String
  -requiredSkills: List
  -experienceRequired: Number
  +parseJD()
}

class MatchResult {
  -id: String
  -resumeId: String
  -jobId: String
  -matchScore: Number
  -explanation: String
  +calculateScore()
  +generateExplanation()
}

class Feedback {
  -id: String
  -matchId: String
  -decision: String
  -rating: Number
  +submitFeedback()
}


%% ========================
%% Service Layer
%% ========================

class ResumeService {
  +processResume(file)
  +getResumeById(id)
  +getResumesByCandidate(candidateId)
}

class JDService {
  +processJD(text)
  +getJDById(id)
  +getJDsByRecruiter(recruiterId)
}

class MatchService {
  +generateMatches(jobId)
  +getMatchResult(resumeId, jobId)
  +getRankedCandidates(jobId)
}

class SkillExtractorService {
  +extractSkills(text) List
  +normalizeSkills(skills) List
}


%% ========================
%% Strategy Layer
%% ========================

class MatchingEngine {
  -scoringStrategy: ScoringStrategy
  +computeSimilarity()
  +calculateMatch()
  +setStrategy()
}

class ScoringStrategy {
  <<interface>>
  +calculateScore(resume, jobDescription)
}

class KeywordOverlapStrategy {
  +calculateScore(resume, jobDescription)
}

class TFIDFStrategy {
  +calculateScore(resume, jobDescription)
}

ScoringStrategy <|.. KeywordOverlapStrategy
ScoringStrategy <|.. TFIDFStrategy

MatchingEngine --> ScoringStrategy


%% ========================
%% Relationships
%% ========================

Candidate "1" --> "many" Resume
Recruiter "1" --> "many" JobDescription
Resume "1" --> "many" MatchResult
JobDescription "1" --> "many" MatchResult
MatchResult "1" --> "0..1" Feedback

MatchingEngine --> Resume
MatchingEngine --> JobDescription
MatchResult --> MatchingEngine

ResumeService --> SkillExtractorService
JDService --> SkillExtractorService
MatchService --> MatchingEngine
```

---

## Planned Enhancements

> The following classes and features were intentionally excluded from the current implementable scope and are planned for future iterations:

1. **Python AI Microservice** — NLP-based text processing, named entity recognition for skill extraction, embedding vector generation using sentence transformers
2. **Embedding-Based Matching (EmbeddingStrategy)** — Semantic similarity scoring using cosine distance on embedding vectors instead of keyword overlap
3. **MongoDB Atlas Vector Search** — Vector storage and retrieval for resume and JD embeddings
4. **Adaptive Scoring Engine** — Dynamically adjusts scoring weights (skill, experience, project, domain) based on historical recruiter feedback using an Observer pattern
5. **Learning Roadmap Generator** — Generates a prioritized, timeline-based upskilling roadmap with resource suggestions based on identified skill gaps
6. **MODEL_VERSION & MODEL_PERFORMANCE tracking** — Database layer for versioning scoring models and storing precision/recall/accuracy metrics over time
7. **Bias Detection & Fairness Monitoring** — Admin-level monitoring for demographic or skill-group bias in candidate rankings
8. **Multi-Model Ensemble Scoring** — Combining outputs from multiple scoring strategies for more robust match accuracy
9. **AI-Powered Interview Question Generator** — Auto-generates role-specific interview questions based on JD and candidate skill gaps
