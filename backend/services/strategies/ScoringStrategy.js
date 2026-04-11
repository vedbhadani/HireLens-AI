// base strategy — all scoring strategies must implement score()
class ScoringStrategy {
  score(resumeSkills, jobSkills) {
    throw new Error('score() must be implemented');
  }
}

module.exports = ScoringStrategy;