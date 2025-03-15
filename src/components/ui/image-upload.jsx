"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export function ImageUpload({
  value,
  onChange,
  label = "",
  description = "Upload an image",
  previewWidth = 200,
  previewHeight = 200,
  aspectRatio = "square",
  className = "",
  section = "misc",
}) {
  const [preview, setPreview] = useState(value);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);

  // Calculate height based on aspect ratio and width
  const getPreviewDimensions = () => {
    let width = previewWidth;
    let height = previewHeight;
    
    if (aspectRatio === "16:9") {
      height = Math.round(width * (9/16));
    } else if (aspectRatio === "3:4") {
      height = Math.round(width * (4/3));
    }
    
    return { width, height };
  };

  const { width, height } = getPreviewDimensions();

  // Function to calculate responsive height based on actual width
  const getResponsiveHeight = (actualWidth) => {
    if (aspectRatio === "16:9") {
      return Math.round(actualWidth * (9/16));
    } else if (aspectRatio === "3:4") {
      return Math.round(actualWidth * (4/3));
    }
    return height;
  };

  // Update preview when value changes externally
  useEffect(() => {
    if (value !== preview) {
      setPreview(value);
      setImageError(false); // Reset error state when value changes
    }
  }, [value, preview]);

  // Handle image loading errors
  const handleImageError = () => {
    console.error(`Failed to load image: ${preview}`);
    setImageError(true);
    // Don't show error toast here as it might be annoying during typing
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a local preview immediately for better UX
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    
    // Start the upload process
    setIsUploading(true);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('section', section);
      
      // Show loading toast
      const loadingToastId = toast.loading('Uploading image...');
      
      // Send the file to the server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      // Get the URL of the uploaded file
      const data = await response.json();
      
      // Update the value with the server URL
      onChange(data.url);
      
      // Dismiss loading toast and show success toast
      toast.dismiss(loadingToastId);
      toast.success('Image uploaded successfully!');
      
      // Clean up the local preview
      URL.revokeObjectURL(localPreview);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image. Please try again.');
      
      // If there's an error, revert to the previous value
      setPreview(value);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreview("");
    setImageError(false);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className} flex flex-col items-center`}>
      <Label className="self-center">{label}</Label>
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            disabled={isUploading}
            className="flex-1"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Image"}
          </Button>
          {preview && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleClear}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-500 text-center">{description}</p>
      {preview && (
        <div className="w-full flex justify-center">
          <div 
            className="mt-4 relative border rounded-md overflow-hidden w-full mx-auto" 
            style={{ 
              maxWidth: `${width}px`,
              aspectRatio: aspectRatio === "16:9" ? "16/9" : aspectRatio === "3:4" ? "3/4" : "1/1"
            }}
          >
            {imageError ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Image failed to load</p>
                </div>
              </div>
            ) : (
              <Image
                src={preview}
                alt={label}
                fill
                className="object-cover"
                onError={handleImageError}
                unoptimized={preview.startsWith('http')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
} 