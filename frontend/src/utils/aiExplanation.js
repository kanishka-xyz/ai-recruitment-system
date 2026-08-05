export function generateExplanation(candidate) {

    const explanation = [];

    // Skill Match
    if (candidate.skill_score >= 80) {
        explanation.push("Excellent skill match with the job description.");
    } else if (candidate.skill_score >= 50) {
        explanation.push("Candidate matches several required skills.");
    } else {
        explanation.push("Candidate is missing many required skills.");
    }

    // Semantic Match
    if (candidate.semantic_score >= 80) {
        explanation.push("Resume has high semantic similarity with the job description.");
    } else if (candidate.semantic_score >= 60) {
        explanation.push("Resume is moderately aligned with the job description.");
    } else {
        explanation.push("Resume has low semantic similarity.");
    }

    // Experience
    if (candidate.experience_score >= 80) {
        explanation.push("Experience satisfies the job requirement.");
    } else {
        explanation.push("Experience partially satisfies the requirement.");
    }

    // Education
    if (candidate.education_score === 100) {
        explanation.push("Educational background matches the requirement.");
    }

    // Recommendation
    explanation.push(
        `Overall Recommendation: ${candidate.recommendation}`
    );

    return explanation;
}