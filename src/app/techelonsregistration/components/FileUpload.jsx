import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, FileIcon } from "lucide-react";
import { toast } from "react-hot-toast";

export default function FileUpload({
  setValue,
  value,
  isSubmitting,
  maxSizeMB = 2,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  // Convert MB to bytes
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSizeBytes) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setFileName(file.name);
    setIsUploading(true);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('section', 'techelons');
      
      // Show loading toast
      const loadingToastId = toast.loading('Uploading file...');
      
      // Send the file to the server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }
      
      // Get the URL of the uploaded file
      const data = await response.json();
      
      // Update the form value with the server URL
      setValue("collegeIdUrl", data.url);
      
      // Dismiss loading toast and show success toast
      toast.dismiss(loadingToastId);
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Failed to upload file. Please try again.');
      setFileName("");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle clear button click
  const handleClear = () => {
    setValue("collegeIdUrl", "");
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle button click to open file dialog
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            disabled={isSubmitting || isUploading}
            className="flex-1"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload College ID"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleClear}
              disabled={isSubmitting || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {fileName && (
          <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            <FileIcon className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm truncate">{fileName}</span>
          </div>
        )}
        
        <Input
          type="text"
          value={value || ""}
          onChange={(e) => setValue("collegeIdUrl", e.target.value)}
          placeholder="Or enter file URL directly"
          disabled={isSubmitting || isUploading}
        />
      </div>
    </div>
  );
} 