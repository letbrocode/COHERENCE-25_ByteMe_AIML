
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
import axios from "axios";

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
  
    const formData = new FormData();
    
    // Match backend keys
    files.forEach((file) => {
      formData.append("resumes", file);  // ✅ Use "resumes" to match Flask
    });
  
    formData.append("required_skills", JSON.stringify(requiredSkills));  // ✅ Use "required_skills"
  
    try {
      const response = await axios.post("http://localhost:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 200) {
        setResumes(response.data);
        setActiveTab("results");
  
        toast({
          title: "Analysis Complete",
          description: `Successfully analyzed ${files.length} resume(s).`,
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: "An error occurred while analyzing resumes.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                    onDeleteFile={handleDeleteFile} jdSkills={[]}                  />
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
