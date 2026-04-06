# HireLens AI - Adaptive AI Hiring & Skill Intelligence Platform

---

## 1. Project Overview

HireLens AI is a full-stack AI-powered hiring intelligence platform designed to assist recruiters in making data-driven hiring decisions and help candidates understand and improve their job competitiveness.

The system analyzes resumes and job descriptions using keyword extraction and weighted overlap scoring. It ranks candidates, identifies skill gaps, and continuously improves its scoring model using recruiter feedback.

The core objective of the system is to move beyond keyword-based resume screening and provide explainable, adaptive, and data-backed candidate evaluation.

---

## 2. Problem Statement

Recruitment processes today face several challenges:

- Manual resume screening is time-consuming and inconsistent.
- Keyword-based Applicant Tracking Systems (ATS) fail to capture contextual relevance.
- Candidates receive little to no structured feedback.
- Hiring decisions are rarely used to improve future screening accuracy.

There is a need for an intelligent system that:
- Understands contextual skill relevance
- Provides transparent match explanations
- Learns from recruiter decisions
- Assists candidates in structured upskilling

---

## 3. Proposed Solution

HireLens AI provides:

1. Resume Intelligence Engine  
2. Job Description Intelligence Engine  
3. AI-Based Matching & Ranking System  
4. Skill Gap Analyzer  
5. Analytics & Model Performance Tracking  

The system uses keyword-overlap scoring combined with weighted feature analysis to compute match scores between candidates and job descriptions.

Recruiter feedback is stored and used to track scoring accuracy over time.

---

## 4. System Scope

### 4.1 Candidate Module

- User registration & authentication
- Resume upload (PDF)
- Resume parsing & structured skill extraction
- Experience estimation
- View job match scores
- Detailed skill match breakdown
- Skill gap identification
- Resume version tracking & progress comparison

---

### 4.2 Recruiter Module

- Job description upload
- Required skill extraction
- Seniority detection
- Candidate ranking dashboard
- Match score explanation view
- Feedback submission (Selected / Rejected / Strong Match)
- Candidate comparison view
- Hiring analytics dashboard

---

### 4.3 Admin Module

- View system usage analytics
- View feedback trends

---

## 5. Core Functional Features

### 5.1 Resume Intelligence Engine
- PDF to text extraction
- NLP preprocessing
- Skill extraction using dictionary + keyword matching
- Structured resume storage

### 5.2 Job Intelligence Engine
- Required skill extraction
- Experience range detection
- Job categorization

### 5.3 Matching Engine
- Keyword-overlap skill scoring
- Weighted scoring model
- Multi-factor match calculation:
  - Skill similarity
  - Experience alignment
  - Project relevance
  - Domain similarity
- Match score persistence

### 5.4 Skill Gap Analyzer
- Missing skill detection
- Skill importance ranking
- Match improvement impact estimation

---

## 6. Non-Functional Requirements

- Secure authentication (JWT-based)
- Role-Based Access Control (RBAC)
- Input validation and sanitization
- Scalable modular backend architecture
- RESTful API design
- Clean separation of concerns
- Logging & error handling
- Version control with regular commits

---

## 7. System Architecture

The backend follows a layered architecture:

- Controllers → Handle HTTP requests
- Services → Business logic
- Repositories → Database operations
- Models → Data schemas
- Strategy Layer → Scoring algorithms

Design Patterns Used:
- Repository Pattern
- Strategy Pattern (KeywordOverlapStrategy, TFIDFStrategy)
- Factory Pattern (Strategy selection)

---

## 8. Technology Stack

Frontend:
- React.js

Backend:
- Node.js
- Express.js

Database:
- MongoDB

AI/Scoring Layer:
- Node.js keyword extraction utility and weighted overlap scoring logic (built-in)
- Weighted scoring logic

Authentication:
- JWT
- Bcrypt

---

## 9. Expected Outcome

The system will:

- Reduce manual resume screening effort
- Provide explainable candidate ranking
- Offer structured skill gap insights
- Store recruiter feedback for future model improvement
- Demonstrate practical integration of MERN stack with AI/ML concepts

---

## 10. Future Enhancements

The following features were intentionally excluded from the current implementable scope and are planned for future iterations:

1. **Python AI Microservice** — NLP-based text processing, named entity recognition for skill extraction, embedding vector generation using sentence transformers
2. **Embedding-Based Matching (EmbeddingStrategy)** — Semantic similarity scoring using cosine distance on embedding vectors instead of keyword overlap
3. **MongoDB Atlas Vector Search** — Vector storage and retrieval for resume and JD embeddings
4. **Adaptive Scoring Engine** — Dynamically adjusts scoring weights (skill, experience, project, domain) based on historical recruiter feedback using an Observer pattern
5. **Learning Roadmap Generator** — Generates a prioritized, timeline-based upskilling roadmap with resource suggestions based on identified skill gaps
6. **MODEL_VERSION & MODEL_PERFORMANCE tracking** — Database layer for versioning scoring models and storing precision/recall/accuracy metrics over time
7. **Bias Detection & Fairness Monitoring** — Admin-level monitoring for demographic or skill-group bias in candidate rankings
8. **Multi-Model Ensemble Scoring** — Combining outputs from multiple scoring strategies for more robust match accuracy
9. **AI-Powered Interview Question Generator** — Auto-generates role-specific interview questions based on JD and candidate skill gaps
