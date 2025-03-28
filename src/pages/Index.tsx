
import { useState, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import FileUploadArea from "@/components/FileUploadArea";
import SkillsInput from "@/components/SkillsInput";
import ResumeDetails from "@/components/ResumeDetails";
import ComparisonChart from "@/components/ComparisonChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, RefreshCw } from "lucide-react";

// Types
export interface Resume {
  id: string;
  fileName: string;
  fileSize: string;
  candidateName: string;
  skills: string[];
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSkillsChange = (skills: string[]) => {
    setRequiredSkills(skills);
  };

  const analyzeResumes = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one resume to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (requiredSkills.length === 0) {
      toast({
        title: "No skills specified",
        description: "Please enter at least one required skill.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const mockResumes: Resume[] = files.map((file, index) => {
        // Generate random skills based on the required skills
        const allSkills = [
          "javascript", "react", "node.js", "typescript", "python", "java", "c++", "aws", 
          "docker", "kubernetes", "mongodb", "sql", "nosql", "redux", "graphql", "rest api",
          "html", "css", "git", "agile", "scrum", "machine learning", "data analysis"
        ];
        
        // Ensure some of the required skills are matched
        const extractedSkills = [...new Set([
          ...requiredSkills.filter(() => Math.random() > 0.3),
          ...allSkills.filter(() => Math.random() > 0.7)
        ])];
        
        const matchedSkills = requiredSkills.filter(skill => 
          extractedSkills.includes(skill)
        );
        
        const missingSkills = requiredSkills.filter(skill => 
          !extractedSkills.includes(skill)
        );
        
        const matchScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);
        
        // Extract candidate name from filename
        let candidateName = file.name.replace(/\.pdf$/i, "");
        candidateName = candidateName.replace(/(_|-)resume/i, "");
        candidateName = candidateName.replace(/(_|-)/g, " ");
        candidateName = candidateName
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
        
        return {
          id: Math.random().toString(36).substring(2, 9),
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(1)} KB`,
          candidateName: candidateName || `Candidate ${index + 1}`,
          skills: extractedSkills,
          matchScore,
          matchedSkills,
          missingSkills
        };
      });

      setResumes(mockResumes);
      setActiveTab("results");
      setLoading(false);

      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${files.length} resume(s).`,
      });
    }, 2000);
  };

  const resetAnalysis = () => {
    setFiles([]);
    setResumes([]);
    setActiveTab("upload");
    setSelectedResumeId(null);
  };

  const selectedResume = selectedResumeId 
    ? resumes.find(resume => resume.id === selectedResumeId) 
    : resumes.length > 0 ? resumes[0] : null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-6">
            <h1 className="text-3xl font-bold text-gray-800">Resume Screening with NLP</h1>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="upload">Upload & Configure</TabsTrigger>
                <TabsTrigger value="results" disabled={resumes.length === 0}>
                  Results
                </TabsTrigger>
                <TabsTrigger value="comparison" disabled={resumes.length < 2}>
                  Comparison
                </TabsTrigger>
              </TabsList>
              
              {activeTab !== "upload" && (
                <Button 
                  variant="outline" 
                  onClick={resetAnalysis}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Start New Analysis
                </Button>
              )}
            </div>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Upload Resumes (PDF)</h2>
                  <FileUploadArea 
                    files={files} 
                    onFilesChange={handleFileChange} 
                    onDeleteFile={handleDeleteFile} 
                  />
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                  <SkillsInput 
                    onSkillsChange={handleSkillsChange} 
                    initialSkills={[]} 
                  />
                  
                  <div className="mt-6">
                    <Button 
                      onClick={analyzeResumes} 
                      disabled={loading || files.length === 0 || requiredSkills.length === 0}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Resumes...
                        </>
                      ) : (
                        "Analyze Resumes"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-6">
              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                    <h2 className="text-xl font-semibold mb-4">Candidates</h2>
                    <div className="space-y-2">
                      {resumes.map((resume) => (
                        <div 
                          key={resume.id}
                          className={`p-3 rounded-md cursor-pointer transition-colors ${
                            selectedResumeId === resume.id 
                              ? 'bg-primary/10 border border-primary/30' 
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                          onClick={() => setSelectedResumeId(resume.id)}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{resume.candidateName}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              resume.matchScore >= 80 
                                ? 'bg-green-100 text-green-800' 
                                : resume.matchScore >= 50 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {resume.matchScore}% Match
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {resume.fileName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  {selectedResume && (
                    <ResumeDetails resume={selectedResume} requiredSkills={requiredSkills} />
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="comparison">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Candidate Comparison</h2>
                <ComparisonChart resumes={resumes} />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
