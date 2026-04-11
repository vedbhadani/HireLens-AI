const KeywordOverlapStrategy = require('./Strategies/KeywordOverlapStrategy');

class MatchingEngine {
  constructor(strategy) {
    // default to keyword overlap, can swap in future
    this.strategy = strategy || new KeywordOverlapStrategy();
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  run(resumeSkills, jobSkills) {
    return this.strategy.score(resumeSkills, jobSkills);
  }
}

module.exports = MatchingEngine;