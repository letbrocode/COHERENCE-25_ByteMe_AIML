
export const analyzeResume = async (file: File, inputSkills: string[], apiKey: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      
      // Simulate realistic extracted skills from the resume
      const extractedSkills = [
        "JavaScript", "React", "MongoDB", "Node.js", "Python", "Flask", "SQL", "Git"
      ];

      // Convert filename to lowercase first
      let candidateName = file.name.toLowerCase();

      // Remove the .pdf extension
      candidateName = candidateName.replace(/\.pdf$/i, "");

      // Clean up the filename
      candidateName = candidateName.replace(/(_|-)resume/i, "");
      candidateName = candidateName.replace(/(_|-)/g, " ");

      // Capitalize each word in the filename
      candidateName = candidateName
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

      // Normalize skills (lowercase everything for consistent comparison)
      const normalizedExtracted = extractedSkills.map(skill => skill.toLowerCase());
      const normalizedInput = inputSkills.map(skill => skill.toLowerCase());

      // Matching and missing skills calculation
      const matchedSkills = normalizedInput.filter(skill =>
        normalizedExtracted.includes(skill)
      );

      const missingSkills = normalizedInput.filter(skill =>
        !normalizedExtracted.includes(skill)
      );

      // Restore original casing for matched and missing skills
      const matchedSkillsOriginal = matchedSkills.map(skill =>
        inputSkills.find(s => s.toLowerCase() === skill)
      );

      const missingSkillsOriginal = missingSkills.map(skill =>
        inputSkills.find(s => s.toLowerCase() === skill)
      );

      const matchScore = Math.round((matchedSkillsOriginal.length / inputSkills.length) * 100);

      // Return structured and accurate results
      resolve({
        candidateName,
        extractedSkills,          // Skills found in the resume
        inputSkills,              // Skills from the `addSkillInput`
        matchScore,               // Match percentage
        matchedSkills: matchedSkillsOriginal,  // Matched skills with original casing
        missingSkills: missingSkillsOriginal   // Missing skills with original casing
      });

    }, 1500);
  });
};
