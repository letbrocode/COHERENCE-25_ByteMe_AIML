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
      const commonSkills = [];

      // Random selection of skills including some of the required ones
      const extractedSkills = [
        ...requiredSkills.filter(() => Math.random() > 0.3), 
        ...commonSkills.filter(() => Math.random() > 0.7)
      ];

      // Convert filename to lowercase first
      let candidateName = file.name.toLowerCase();

      // Remove the .pdf extension
      candidateName = candidateName.replace(/\.pdf$/i, "");

      // Clean up the filename
      candidateName = candidateName.replace(/(_|-)resume/i, ""); 
      candidateName = candidateName.replace(/(_|-)/g, " "); 

      // Capitalize each word
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
