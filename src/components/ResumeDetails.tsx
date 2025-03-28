
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle } from "lucide-react";
import { Resume } from "@/pages/Index";
import { cn } from "@/lib/utils";

interface ResumeDetailsProps {
  resume: Resume;
  requiredSkills: string[];
}

const ResumeDetails = ({ resume, requiredSkills }: ResumeDetailsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColorClass = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 50) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{resume.candidateName}</CardTitle>
              <p className="text-sm text-gray-500">{resume.fileName} • {resume.fileSize}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold mb-1 leading-none">
                <span className={getScoreColor(resume.matchScore)}>
                  {resume.matchScore}%
                </span>
              </div>
              <p className="text-sm text-gray-500">Match Score</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress 
            value={resume.matchScore} 
            className={cn("h-2 mt-2", getProgressColorClass(resume.matchScore))}
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2 flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" /> 
                Matched Skills ({resume.matchedSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {resume.matchedSkills.length > 0 ? (
                  resume.matchedSkills.map(skill => (
                    <Badge key={skill} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No matching skills found</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 flex items-center text-red-600">
                <XCircle className="h-4 w-4 mr-2" /> 
                Missing Skills ({resume.missingSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {resume.missingSkills.length > 0 ? (
                  resume.missingSkills.map(skill => (
                    <Badge key={skill} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No missing skills</p>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-medium mb-3">All Extracted Skills</h3>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map(skill => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeDetails;
