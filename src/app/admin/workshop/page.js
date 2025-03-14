"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import siteContent from "@/app/_data/siteContent";
import { ImageUpload } from "@/components/ui/image-upload";

export default function WorkshopManagement() {
  const router = useRouter();
  const [workshop, setWorkshop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
          setWorkshop(JSON.parse(JSON.stringify(siteContent.workshop)));
        }
      } catch (error) {
        console.error("Error fetching workshop data:", error);
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

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workshop Management</h1>
          <p className="text-muted-foreground">
            Manage workshop details and registration settings
          </p>
        </div>
        <Button onClick={saveWorkshop} disabled={isSaving}>
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
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the workshop's basic details and registration status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Workshop Title</Label>
              <Input
                id="title"
                value={workshop.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                value={workshop.shortDescription}
                onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isRegistrationOpen"
                checked={workshop.isRegistrationOpen}
                onCheckedChange={(checked) => handleInputChange("isRegistrationOpen", checked)}
              />
              <Label htmlFor="isRegistrationOpen">Registration Open</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsappGroupLink">WhatsApp Group Link</Label>
              <Input
                id="whatsappGroupLink"
                value={workshop.whatsappGroupLink}
                onChange={(e) => handleInputChange("whatsappGroupLink", e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Banner Image</CardTitle>
            <CardDescription>
              Upload or update the workshop's banner image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={workshop.bannerImage}
              onChange={(value) => handleInputChange("bannerImage", value)}
              onRemove={() => handleInputChange("bannerImage", "")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workshop Details</CardTitle>
            <CardDescription>
              Add and manage workshop-specific details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-4">
                {workshop.details.map((detail, index) => (
                  <div key={detail.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveDetail(index, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveDetail(index, 'down')}
                        disabled={index === workshop.details.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDetail(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Label</Label>
                        <Input
                          value={detail.label}
                          onChange={(e) => handleDetailChange(index, "label", e.target.value)}
                          placeholder="e.g., Date, Time, Location"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input
                          value={detail.value}
                          onChange={(e) => handleDetailChange(index, "value", e.target.value)}
                          placeholder="Enter the value"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
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
      </div>
    </div>
  );
} 