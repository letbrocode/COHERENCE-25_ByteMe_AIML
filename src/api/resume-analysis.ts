
/**
 * This file contains API simulation functions for resume analysis.
 * In a real application, these functions would call a backend API endpoint.
 */

// Mock NLP processing to extract skills and information from a resume
export const analyzeResume = async (file: File, requiredSkills: string[], apiKey: string) => {
  // In a real application, we would send the file to a backend API
  // Here we just simulate the response
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulated extracted skills
      const commonSkills = [
        "javascript", "react", "node.js", "typescript", "python", "java", "c++", "aws", 
        "docker", "kubernetes", "mongodb", "sql", "nosql", "redux", "graphql", "rest api",
        "html", "css", "git", "agile", "scrum", "machine learning", "data analysis"
      ];
      
      // Random selection of skills including some of the required ones
      const extractedSkills = [
        ...requiredSkills.filter(() => Math.random() > 0.3), 
        ...commonSkills.filter(() => Math.random() > 0.7)
      ];
      
      // Candidate name based on file name
      let candidateName = file.name.replace(/\.pdf$/i, "");
      candidateName = candidateName.replace(/(_|-)resume/i, "");
      candidateName = candidateName.replace(/(_|-)/g, " ");
      candidateName = candidateName
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
      
      // Calculate match score
      const matchedSkills = requiredSkills.filter(skill => 
        extractedSkills.some(extracted => extracted.toLowerCase() === skill.toLowerCase())
      );
      
      const missingSkills = requiredSkills.filter(skill => 
        !extractedSkills.some(extracted => extracted.toLowerCase() === skill.toLowerCase())
      );
      
      const matchScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);
      
      resolve({
        candidateName,
        extractedSkills,
        matchScore,
        matchedSkills,
        missingSkills
      });
    }, 1500);
  });
};
