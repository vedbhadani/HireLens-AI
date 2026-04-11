const ScoringStrategy = require('./ScoringStrategy');

class KeywordOverlapStrategy extends ScoringStrategy {
  score(resumeSkills, jobSkills) {
    if (!jobSkills.length) return 0;

    const resumeSet = new Set(resumeSkills.map(s => s.toLowerCase()));
    const matched = jobSkills.filter(s => resumeSet.has(s.toLowerCase()));

    // score is percentage of job skills found in resume
    const percentage = (matched.length / jobSkills.length) * 100;

    return {
      score: Math.round(percentage),
      matchedSkills: matched,
      missingSkills: jobSkills.filter(s => !resumeSet.has(s.toLowerCase())),
    };
  }
}

module.exports = KeywordOverlapStrategy;