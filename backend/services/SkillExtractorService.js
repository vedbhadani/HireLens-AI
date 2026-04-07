// common tech skills to match against — expand this list over time
const SKILL_KEYWORDS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'ruby',
  'react', 'angular', 'vue', 'next.js', 'node.js', 'express', 'fastapi',
  'django', 'spring', 'flask',
  'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
  'git', 'rest', 'graphql', 'grpc',
  'machine learning', 'deep learning', 'nlp', 'computer vision',
  'html', 'css', 'tailwind', 'sass',
  'linux', 'bash', 'ci/cd', 'jenkins', 'github actions',
  'agile', 'scrum', 'jira',
];

class SkillExtractorService {
  extract(text) {
    if (!text) return [];

    const lower = text.toLowerCase();
    const found = SKILL_KEYWORDS.filter(skill => lower.includes(skill));

    // deduplicate just in case
    return [...new Set(found)];
  }
}

module.exports = new SkillExtractorService();