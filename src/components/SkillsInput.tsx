import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { extractKeywordsFromJD } from '../server/api-handler'; 

interface SkillsInputProps {
  initialSkills?: string[];
  onSkillsChange: (skills: string[]) => void;   // ✅ Setter function
}

const SkillsInput = ({ 
  initialSkills = [], 
  onSkillsChange 
}: SkillsInputProps) => {

  const [skills, setSkills] = useState<string[]>(Array.isArray(initialSkills) ? initialSkills : []);
  const [currentInput, setCurrentInput] = useState("");
  const [jdText, setJDText] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- Add skill function ---
  const addSkill = (skill: string) => {
    const sanitizedSkill = skill.trim().toLowerCase();
    if (sanitizedSkill && !skills.includes(sanitizedSkill)) {
      setSkills((prevSkills) => [...prevSkills, sanitizedSkill]);
      onSkillsChange([...skills, sanitizedSkill]);   // ✅ Trigger parent update
    }
  };

  // --- Remove skill ---
  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    onSkillsChange(updatedSkills);   // ✅ Trigger parent update
  };

  // --- Handle JD Analysis ---
  const handleAnalyzeClick = async () => {
    if (!jdText.trim()) {
      console.warn("⚠️ Please enter JD text before analyzing.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const keywords = await extractKeywordsFromJD(jdText);

      console.log("Extracted keywords:", keywords);

      // ✅ Automatically add each extracted keyword
      if (Array.isArray(keywords)) {
        keywords.forEach((keyword) => addSkill(keyword));
      }

    } catch (error) {
      console.error("❌ Failed to analyze JD:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* --- JD Input --- */}
      <textarea
        placeholder="Enter JD here..."
        value={jdText}
        onChange={(e) => setJDText(e.target.value)}
        rows={5}
        cols={50}
        className="w-full border rounded-md p-2"
      />

      <Button 
        onClick={handleAnalyzeClick} 
        disabled={isAnalyzing}
        className="bg-blue-500 text-white"
      >
        {isAnalyzing ? "Analyzing..." : "Analyze JD"}
      </Button>

      <div className="flex gap-2">
        <Input
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSkill(currentInput)}
          placeholder="Add skills and press Enter"
          className="flex-1"
        />
        <Button 
          onClick={() => addSkill(currentInput)} 
          disabled={!currentInput.trim()}
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* ✅ Display extracted and manual skills */}
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-sm">
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-sm text-gray-500">
          No skills added yet. You can add skills by typing above.
        </div>
      )}
    </div>
  );
};

export default SkillsInput;
