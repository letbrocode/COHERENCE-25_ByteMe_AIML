
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface SkillsInputProps {
  initialSkills?: string[];
  onSkillsChange: (skills: string[]) => void;
}

const SkillsInput = ({ 
  initialSkills = [], 
  onSkillsChange 
}: SkillsInputProps) => {
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [currentInput, setCurrentInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentInput.trim()) {
      e.preventDefault();
      addSkill();
    } else if (e.key === "," && currentInput.trim()) {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const sanitizedInput = currentInput.trim().toLowerCase();
    if (sanitizedInput && !skills.includes(sanitizedInput)) {
      const updatedSkills = [...skills, sanitizedInput];
      setSkills(updatedSkills);
      onSkillsChange(updatedSkills);
      setCurrentInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    onSkillsChange(updatedSkills);
  };

  const commonSkills = [
    "javascript", "python", "java", "react", "angular", 
    "node.js", "aws", "docker", "kubernetes", "sql"
  ];

  const handleCommonSkillClick = (skill: string) => {
    if (!skills.includes(skill)) {
      const updatedSkills = [...skills, skill];
      setSkills(updatedSkills);
      onSkillsChange(updatedSkills);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type skills and press Enter or comma (,)"
          className="flex-1"
        />
        <Button 
          onClick={addSkill} 
          disabled={!currentInput.trim()}
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

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

      <div className="border-t pt-4">
        <p className="text-sm font-medium mb-2">Common Skills:</p>
        <div className="flex flex-wrap gap-2">
          {commonSkills.map((skill) => (
            <Badge 
              key={skill} 
              variant="outline" 
              className={`cursor-pointer ${skills.includes(skill) ? 'bg-primary/10' : ''}`}
              onClick={() => handleCommonSkillClick(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsInput;
