import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from 'axios'; // Make sure to install axios for making API requests

interface FileUploadAreaProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onDeleteFile: (index: number) => void;
  jdSkills: string[]; // Job description skills
}

const FileUploadArea = ({ 
  files, 
  onFilesChange, 
  onDeleteFile, 
  jdSkills 
}: FileUploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );

    if (droppedFiles.length > 0) {
      onFilesChange(droppedFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter(
        (file) => file.type === "application/pdf"
      );
      onFilesChange(selectedFiles);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle the file submission to backend
  const onAnalyze = async () => {
    if (files.length === 0) {
      alert("Please upload at least one file.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("resumes", file); // Append the uploaded resumes
    });

   //api call here
     try {
    // Send the FormData to the backend via POST request
       const response = await axios.post("http://localhost:5000/upload", formData, {
         headers: {
           "Content-Type": "multipart/form-data", // Ensure it's sent as FormData
         },
       });

    // Handle the response from the backend
       console.log("Files uploaded successfully:", response.data);
       alert("Files uploaded successfully!");
     }catch (error) {
       console.error("Error uploading files:", error);
       alert("Error uploading files. Please try again.");
     } finally {
       setIsSubmitting(false);
     }
      

  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-md p-8 text-center transition-colors cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary/50"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".pdf"
          multiple
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <h3 className="text-lg font-medium">Drag and drop files here</h3>
          <p className="text-sm text-gray-500">
            Or click to browse (PDF only, max 10MB)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 border rounded-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 text-sm font-medium border-b">
            Uploaded Files ({files.length})
          </div>
          <ul className="divide-y">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px] md:max-w-[300px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(index);
                  }}
                  className="h-7 w-7"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <Button onClick={onAnalyze} disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Upload Resumes"}
        </Button>
      </div>

      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-medium">Analysis Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUploadArea;
