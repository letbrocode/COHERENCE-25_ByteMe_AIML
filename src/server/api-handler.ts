import axios from 'axios';
import { isPdf, mockApiResponse } from "@/lib/utils";

export interface ResumeAnalysisResult {
  candidateName: string;
  extractedSkills: string[];
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

// --- API Base URL ---
const FLASK_API_URL = 'http://127.0.0.1:5000/api/extract_keywords';

// --- Function to Extract Keywords ---
export const extractKeywordsFromJD = async (jdText: string): Promise<string[]> => {
  try {
    const response = await axios.post(FLASK_API_URL, { jd: jdText });

    if (response.status === 200) {
      const filteredKeywords = response.data.filtered_keywords || [];

      if (filteredKeywords.length > 0) {
        console.log('✅ Extracted Keywords:', filteredKeywords);
        return filteredKeywords;  // ✅ Return the keywords array
      } else {
        console.warn('⚠️ No keywords extracted.');
        return [];
      }
    } else {
      console.error(`❌ Failed to fetch keywords: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.error('❌ Error extracting keywords:', error);
    return [];
  }
};

// --- Simulate NLP processing for resume text extraction ---
const extractResumeText = async (file: File): Promise<string> => {
  // Simulate PDF text extraction
  return mockApiResponse(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Experience in JavaScript, React, Node.js, and Python. Proficient in AWS, Docker, and Kubernetes.",
    500
  );
};

// --- Simulate NLP processing for skills extraction ---
const extractSkills = async (text: string): Promise<string[]> => {
  const mockSkills = [
    "javascript", 
    "react", 
    "node.js", 
    "python", 
    "aws", 
    "docker", 
    "kubernetes"
  ];
  
  // Simulate partial extraction for realism
  return mockApiResponse(
    mockSkills.filter(() => Math.random() > 0.3),
    700
  );
};

// --- Simulate candidate name extraction ---
const extractCandidateName = async (text: string, fileName: string): Promise<string> => {
  let candidateName = fileName.replace(/\.pdf$/i, "")
                             .replace(/(_|-)resume/i, "")
                             .replace(/(_|-)/g, " ");

  candidateName = candidateName
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return mockApiResponse(candidateName, 300);
};

// --- Main Resume Analysis Handler ---
export const analyzeResume = async (
  file: File,
  requiredSkills: string[]
): Promise<ResumeAnalysisResult> => {
  if (!isPdf(file)) {
    throw new Error("Only PDF files are supported");
  }

  const text = await extractResumeText(file);
  const extractedSkills = await extractSkills(text);
  const candidateName = await extractCandidateName(text, file.name);

  // Match skills against required skills
  const matchedSkills = requiredSkills.filter(skill => 
    extractedSkills.some(extracted => extracted.toLowerCase() === skill.toLowerCase())
  );
  
  const missingSkills = requiredSkills.filter(skill => 
    !extractedSkills.some(extracted => extracted.toLowerCase() === skill.toLowerCase())
  );

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
