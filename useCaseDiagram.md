# Use Case Diagram – HireLens AI

```mermaid
flowchart TB

%% Actors
Candidate([Candidate])
Recruiter([Recruiter])
Admin([Admin])

%% Candidate Module
subgraph Candidate_Module
direction TB
C1((Register / Login))
C2((Upload Resume))
C3((View Resume Analysis))
C4((View Match Scores))
C5((Skill Gap Analysis))
C6((Compare Resume Versions))
end

%% Recruiter Module
subgraph Recruiter_Module
direction TB
R1((Upload Job Description))
R2((View Ranked Candidates))
R3((View Match Explanation))
R4((Provide Feedback))
R5((View Hiring Analytics))
end

%% Admin Module
subgraph Admin_Module
direction TB
A1((Monitor System Analytics))
A2((View Feedback Trends))
end

%% Core Engine Module
subgraph Core_Engine
direction TB
E1((Resume Parsing))
E2((JD Parsing))
E3((Compute Match Score))
end

%% Actor Connections
Candidate --> C1
Candidate --> C2
Candidate --> C3
Candidate --> C4
Candidate --> C5
Candidate --> C6

Recruiter --> R1
Recruiter --> R2
Recruiter --> R3
Recruiter --> R4
Recruiter --> R5

Admin --> A1
Admin --> A2

%% Internal Flow
C2 --> E1
R1 --> E2
C4 --> E3
R2 --> E3
```

---

## Planned Enhancements

> The following use cases and features were intentionally excluded from the current implementable scope and are planned for future iterations:

1. **Python AI Microservice** — NLP-based text processing, named entity recognition for skill extraction, embedding vector generation using sentence transformers
2. **Embedding-Based Matching (EmbeddingStrategy)** — Semantic similarity scoring using cosine distance on embedding vectors instead of keyword overlap
3. **MongoDB Atlas Vector Search** — Vector storage and retrieval for resume and JD embeddings
4. **Adaptive Scoring Engine** — Dynamically adjusts scoring weights (skill, experience, project, domain) based on historical recruiter feedback using an Observer pattern
5. **Learning Roadmap Generator** — Generates a prioritized, timeline-based upskilling roadmap with resource suggestions based on identified skill gaps
6. **MODEL_VERSION & MODEL_PERFORMANCE tracking** — Database layer for versioning scoring models and storing precision/recall/accuracy metrics over time
7. **Bias Detection & Fairness Monitoring** — Admin-level monitoring for demographic or skill-group bias in candidate rankings
8. **Multi-Model Ensemble Scoring** — Combining outputs from multiple scoring strategies for more robust match accuracy
9. **AI-Powered Interview Question Generator** — Auto-generates role-specific interview questions based on JD and candidate skill gaps
