# ER Diagram – HireLens AI

```mermaid
erDiagram

USER {
    string _id PK
    string name
    string email
    string passwordHash
    string role
    boolean isActive
    date createdAt
    date updatedAt
}

REFRESH_TOKEN {
    string _id PK
    string userId FK
    string token
    date expiresAt
    boolean isRevoked
}

CANDIDATE_PROFILE {
    string _id PK
    string userId FK
    string headline
    string location
    number totalExperienceYears
    date createdAt
}

RESUME {
    string _id PK
    string candidateId FK
    string version
    string rawText
    number experienceYears
    date createdAt
}

RESUME_SKILL {
    string _id PK
    string resumeId FK
    string skillName
    number proficiencyScore
}

RESUME_PROJECT {
    string _id PK
    string resumeId FK
    string title
    string description
    string techStack
}

RECRUITER_PROFILE {
    string _id PK
    string userId FK
    string companyName
    string designation
    date createdAt
}

JOB_DESCRIPTION {
    string _id PK
    string recruiterId FK
    string title
    string description
    number experienceRequired
    date createdAt
}

JOB_REQUIRED_SKILL {
    string _id PK
    string jobId FK
    string skillName
    number importanceWeight
}

MATCH_RESULT {
    string _id PK
    string resumeId FK
    string jobId FK
    number overallScore
    number skillScore
    number experienceScore
    number projectScore
    string matchedSkills
    string missingSkills
    string explanation
    date createdAt
}

FEEDBACK {
    string _id PK
    string matchResultId FK
    string recruiterId FK
    string decision
    number rating
    string comments
    date createdAt
}

ANALYTICS_EVENT {
    string _id PK
    string userId FK
    string eventType
    string metadata
    date createdAt
}

%% Relationships

USER ||--o{ REFRESH_TOKEN : owns
USER ||--|| CANDIDATE_PROFILE : has
USER ||--|| RECRUITER_PROFILE : has

CANDIDATE_PROFILE ||--o{ RESUME : uploads
RESUME ||--o{ RESUME_SKILL : contains
RESUME ||--o{ RESUME_PROJECT : includes

RECRUITER_PROFILE ||--o{ JOB_DESCRIPTION : posts
JOB_DESCRIPTION ||--o{ JOB_REQUIRED_SKILL : requires

RESUME ||--o{ MATCH_RESULT : evaluated
JOB_DESCRIPTION ||--o{ MATCH_RESULT : generates

MATCH_RESULT ||--o{ FEEDBACK : receives

USER ||--o{ ANALYTICS_EVENT : generates
```

---

## Planned Enhancements

> The following entities and features were intentionally excluded from the current implementable scope and are planned for future iterations:

1. **Python AI Microservice** — NLP-based text processing, named entity recognition for skill extraction, embedding vector generation using sentence transformers
2. **Embedding-Based Matching (EmbeddingStrategy)** — Semantic similarity scoring using cosine distance on embedding vectors instead of keyword overlap
3. **MongoDB Atlas Vector Search** — Vector storage and retrieval for resume and JD embeddings
4. **Adaptive Scoring Engine** — Dynamically adjusts scoring weights (skill, experience, project, domain) based on historical recruiter feedback using an Observer pattern
5. **Learning Roadmap Generator** — Generates a prioritized, timeline-based upskilling roadmap with resource suggestions based on identified skill gaps
6. **MODEL_VERSION & MODEL_PERFORMANCE tracking** — Database layer for versioning scoring models and storing precision/recall/accuracy metrics over time
7. **Bias Detection & Fairness Monitoring** — Admin-level monitoring for demographic or skill-group bias in candidate rankings
8. **Multi-Model Ensemble Scoring** — Combining outputs from multiple scoring strategies for more robust match accuracy
9. **AI-Powered Interview Question Generator** — Auto-generates role-specific interview questions based on JD and candidate skill gaps
