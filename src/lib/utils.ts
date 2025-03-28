
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format file size from bytes to KB, MB, etc.
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Extract extension from filename
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

// Check if a file is a PDF
export function isPdf(file: File): boolean {
  return file.type === 'application/pdf';
}

// Create a mock backend API response when in demo mode
export function mockApiResponse(data: any, delay = 1000): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
}
