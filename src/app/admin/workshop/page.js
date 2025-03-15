// NOTE: This file was automatically updated to use fetchSiteContent instead of importing siteContent directly.
// Please review and update the component to use the async fetchSiteContent function.
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Plus, Trash2, ArrowUp, ArrowDown, AlertTriangle, Download } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchSiteContent } from '@/lib/utils';
import { ImageUpload } from "@/components/ui/image-upload";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function WorkshopManagement() {
  const router = useRouter();
  const [workshop, setWorkshop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFlushingData, setIsFlushingData] = useState(false);
  const [isExportingData, setIsExportingData] = useState(false);

  // Load workshop data on component mount
  useEffect(() => {
    const fetchWorkshopData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/workshop');
        
        if (response.ok) {
          const data = await response.json();
          setWorkshop(data);
        } else {
          const siteContent = await fetchSiteContent();
          setWorkshop(JSON.parse(JSON.stringify(siteContent.workshop)));
        }
      } catch (error) {
        console.error("Error fetching workshop data:", error);
        const siteContent = await fetchSiteContent();
        setWorkshop(JSON.parse(JSON.stringify(siteContent.workshop)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshopData();
  }, []);

  const handleInputChange = (field, value) => {
    setWorkshop((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDetailChange = (index, field, value) => {
    setWorkshop((prev) => {
      const newDetails = [...prev.details];
      newDetails[index] = { ...newDetails[index], [field]: value };
      return {
        ...prev,
        details: newDetails,
      };
    });
  };

  const addNewDetail = () => {
    setWorkshop((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        {
          id: `detail-${Date.now()}`,
          label: "",
          value: "",
        },
      ],
    }));
  };

  const removeDetail = (index) => {
    setWorkshop((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  const moveDetail = (index, direction) => {
    setWorkshop((prev) => {
      const newDetails = [...prev.details];
      if (direction === 'up' && index > 0) {
        [newDetails[index], newDetails[index - 1]] = [newDetails[index - 1], newDetails[index]];
      } else if (direction === 'down' && index < newDetails.length - 1) {
        [newDetails[index], newDetails[index + 1]] = [newDetails[index + 1], newDetails[index]];
      }
      return {
        ...prev,
        details: newDetails,
      };
    });
  };

  const saveWorkshop = async () => {
    try {
      setIsSaving(true);
      const loadingToastId = toast.loading('Saving workshop data...');
      
      const response = await fetch('/api/workshop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workshop),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save workshop data');
      }
      
      toast.dismiss(loadingToastId);
      toast.success('Workshop data saved successfully!');
      router.refresh();
    } catch (error) {
      console.error("Error saving workshop data:", error);
      toast.error(error.message || "Failed to save workshop data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const flushWorkshopRegistrationData = async () => {
    try {
      setIsFlushingData(true);
      const loadingToastId = toast.loading('Flushing workshop registration data...');
      
      const response = await fetch('/api/workshop/flush-registrations', {
        method: 'DELETE',
      });
      
      toast.dismiss(loadingToastId);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to flush workshop registration data');
      }
      
      const result = await response.json();
      toast.success(`Workshop registration data flushed successfully! ${result.deletedCount} registrations deleted.`);
    } catch (error) {
      console.error("Error flushing workshop registration data:", error);
      toast.error(error.message || "Failed to flush workshop registration data. Please try again.");
    } finally {
      setIsFlushingData(false);
    }
  };

  const exportWorkshopRegistrationData = async () => {
    try {
      setIsExportingData(true);
      const loadingToastId = toast.loading('Preparing workshop registration data for download...');
      
      // Fetch the CSV data
      const response = await fetch('/api/workshop/export-registrations');
      
      toast.dismiss(loadingToastId);
      
      if (!response.ok) {
        // If response is not OK, try to parse the error message
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to export workshop registration data');
        } catch (jsonError) {
          // If we can't parse JSON, use the status text
          throw new Error(`Failed to export workshop registration data: ${response.statusText}`);
        }
      }
      
      // Check if the response is empty (just headers)
      const text = await response.text();
      const lines = text.trim().split('\n');
      
      if (lines.length <= 1) {
        toast.success('CSV file downloaded successfully. No registrations found.');
      } else {
        toast.success('Workshop registration data downloaded successfully!');
      }
      
      // Convert the text back to a blob for download
      const blob = new Blob([text], { type: 'text/csv' });
      
      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'workshop-registrations.csv';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting workshop registration data:", error);
      toast.error(error.message || "Failed to export workshop registration data. Please try again.");
    } finally {
      setIsExportingData(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Workshop Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage workshop details and registration settings
          </p>
        </div>
        <Button onClick={saveWorkshop} disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Separator />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Basic Information</CardTitle>
            <CardDescription className="text-sm">
              Update the workshop's basic details and registration status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Workshop Title</Label>
              <Input
                id="title"
                value={workshop.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shortDescription" className="text-sm font-medium">Short Description</Label>
              <Textarea
                id="shortDescription"
                value={workshop.shortDescription}
                onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                className="min-h-[100px] w-full"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isRegistrationOpen"
                checked={workshop.isRegistrationOpen}
                onCheckedChange={(checked) => handleInputChange("isRegistrationOpen", checked)}
              />
              <Label htmlFor="isRegistrationOpen" className="text-sm font-medium">Registration Open</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsappGroupLink" className="text-sm font-medium">WhatsApp Group Link</Label>
              <Input
                id="whatsappGroupLink"
                value={workshop.whatsappGroupLink}
                onChange={(e) => handleInputChange("whatsappGroupLink", e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Banner Image</CardTitle>
            <CardDescription className="text-sm">
              Upload or update the workshop's banner image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={workshop.bannerImage}
              onChange={(value) => handleInputChange("bannerImage", value)}
              onRemove={() => handleInputChange("bannerImage", "")}
              previewWidth={400}
              aspectRatio="16:9"
              description="Upload a banner image (16:9 aspect ratio recommended)"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Workshop Details</CardTitle>
            <CardDescription className="text-sm">
              Add and manage workshop-specific details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {workshop.details.map((detail, index) => (
                <div key={detail.id} className="space-y-2 border p-3 sm:p-4 rounded-md">
                  <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                    <div className="font-medium text-sm sm:text-base">Detail: {index + 1}</div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveDetail(index, 'up')}
                        disabled={index === 0}
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        aria-label="Move up"
                      >
                        <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveDetail(index, 'down')}
                        disabled={index === workshop.details.length - 1}
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        aria-label="Move down"
                      >
                        <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDetail(index)}
                        className="text-destructive h-7 w-7 sm:h-8 sm:w-8"
                        aria-label="Remove detail"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Label</Label>
                      <Input
                        value={detail.label}
                        onChange={(e) => handleDetailChange(index, "label", e.target.value)}
                        placeholder="e.g., Date, Time, Location"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Value</Label>
                      <Input
                        value={detail.value}
                        onChange={(e) => handleDetailChange(index, "value", e.target.value)}
                        placeholder="Enter the value"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={addNewDetail}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Detail
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2 text-xl">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-sm">
              Actions that cannot be undone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Workshop Registration Data</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Download or flush all workshop registration data. Flushing data cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <Button 
                  variant="outline" 
                  onClick={exportWorkshopRegistrationData}
                  disabled={isExportingData}
                  className="w-full sm:flex-1 text-sm"
                >
                  {isExportingData ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Download as CSV
                    </>
                  )}
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isFlushingData} className="w-full sm:flex-1 text-sm">
                      {isFlushingData ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                          Flushing Data...
                        </>
                      ) : (
                        "Flush Registration Data"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md mx-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all workshop registration data from the database.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={flushWorkshopRegistrationData} className="bg-destructive text-white hover:bg-destructive/90 w-full sm:w-auto">
                        Yes, Flush All Data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 