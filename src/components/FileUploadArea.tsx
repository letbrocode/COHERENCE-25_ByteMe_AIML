
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadAreaProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onDeleteFile: (index: number) => void;
}

const FileUploadArea = ({ 
  files, 
  onFilesChange, 
  onDeleteFile 
}: FileUploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    </div>
  );
};

export default FileUploadArea;
