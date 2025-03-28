
/**
 * This file simulates a backend API handler.
 * In a real application, this would be implemented in a backend server.
 */

import { isPdf, mockApiResponse } from "@/lib/utils";

export interface ResumeAnalysisResult {
  candidateName: string;
  extractedSkills: string[];
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

// Simulate NLP processing for resume text extraction
const extractResumeText = async (file: File): Promise<string> => {
  // In a real application, we'd use a PDF parser library or API
  // For this simulation, we'll just return a mock text
  return mockApiResponse(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Experience in JavaScript, React, Node.js, and Python. Proficient in AWS, Docker, and Kubernetes.",
    500
  );
};

// Simulate NLP processing for skills extraction
const extractSkills = async (text: string): Promise<string[]> => {
  // In a real application, we'd use NLP to extract skills from the text
  // For this simulation, we'll just return a predefined list of skills
  const mockSkills = [
    "javascript", 
    "react", 
    "node.js", 
    "python", 
    "aws", 
    "docker", 
    "kubernetes"
  ];
  
  // Add some randomness to make it more realistic
  return mockApiResponse(
    mockSkills.filter(() => Math.random() > 0.3),
    700
  );
};

// Simulate NLP processing for candidate name extraction
const extractCandidateName = async (text: string, fileName: string): Promise<string> => {
  // In a real application, we'd use NLP to extract the name from the text
  // For this simulation, we'll generate a name based on the file name
  let candidateName = fileName.replace(/\.pdf$/i, "");
  candidateName = candidateName.replace(/(_|-)resume/i, "");
  candidateName = candidateName.replace(/(_|-)/g, " ");
  candidateName = candidateName
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  
  return mockApiResponse(candidateName, 300);
};

// Main API handler for resume analysis
export const analyzeResume = async (
  file: File,
  requiredSkills: string[]
): Promise<ResumeAnalysisResult> => {
  if (!isPdf(file)) {
    throw new Error("Only PDF files are supported");
  }

  // Extract text from resume
  const text = await extractResumeText(file);
  
  // Extract skills from text
  const extractedSkills = await extractSkills(text);
  
  // Extract candidate name
  const candidateName = await extractCandidateName(text, file.name);
  
  // Match skills against required skills
  const matchedSkills = requiredSkills.filter(skill => 
    extractedSkills.some(extracted => extracted.toLowerCase() === skill.toLowerCase())
  );
  
  const missingSkills = requiredSkills.filter(skill => 
    !extractedSkills.some(extracted => extracted.toLowerCase() === skill.toLowerCase())
  );
  
  // Calculate match score
  const matchScore = requiredSkills.length > 0
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 0;
  
  return {
    candidateName,
    extractedSkills,
    matchScore,
    matchedSkills,
    missingSkills
  };
};
