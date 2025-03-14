"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, PlusCircle, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageUpload } from "@/components/ui/image-upload";

export default function TechelonsContentManagement() {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  // Define placeholder image URLs
  const PLACEHOLDER_IMAGES = {
    feature: "https://placehold.co/600x400/333/white?text=Feature+Image",
  };
  
  const [newFeature, setNewFeature] = useState({
    title: "",
    icon: "🏆",
    description: ""
  });

  // Load content on component mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/techelons');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Techelons data');
        }
        
        const data = await response.json();
        
        // Check if there's UI content in the response
        if (data.uiContent) {
          setContent(data.uiContent);
        } else {
          // Initialize with default UI content structure
          setContent({
            title: "Techelons'25",
            subtitle: "Shivaji College's premier technical festival, where innovation meets creativity.",
            festDate: "April 2025",
            aboutTitle: "About Techelons",
            aboutParagraphs: [
              "Techelons is the annual tech fest by Websters, the CS Society of Shivaji College, DU. It's where students showcase technical skills through competitions, hackathons, and coding challenges.",
              "Beyond competitions, Techelons features expert-led seminars on emerging tech and industry trends. The fest promotes networking and collaboration among students and professionals in a celebration of technological innovation."
            ],
            exploreTitle: "Explore the Future of Technology",
            exploreDescription: "Join us for two days of innovation, competition, and creativity at Shivaji College. Showcase your skills and connect with tech enthusiasts from across the nation.",
            features: [
              {
                title: "Competitions",
                icon: "🏆",
                description: "Participate in coding, analysis, and gaming competitions with exciting prizes."
              },
              {
                title: "Seminar",
                icon: "🎤",
                description: "Gain insights from industry leaders through engaging and informative seminars."
              },
              {
                title: "Networking",
                icon: "🌐",
                description: "Connect with tech enthusiasts and industry professionals."
              }
            ]
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching Techelons content:', error);
        toast.error('Failed to load Techelons content');
        
        // Initialize with default UI content structure
        setContent({
          title: "Techelons'25",
          subtitle: "Shivaji College's premier technical festival, where innovation meets creativity.",
          festDate: "April 2025",
          aboutTitle: "About Techelons",
          aboutParagraphs: [
            "Techelons is the annual tech fest by Websters, the CS Society of Shivaji College, DU. It's where students showcase technical skills through competitions, hackathons, and coding challenges.",
            "Beyond competitions, Techelons features expert-led seminars on emerging tech and industry trends. The fest promotes networking and collaboration among students and professionals in a celebration of technological innovation."
          ],
          exploreTitle: "Explore the Future of Technology",
          exploreDescription: "Join us for two days of innovation, competition, and creativity at Shivaji College. Showcase your skills and connect with tech enthusiasts from across the nation.",
          features: [
            {
              title: "Competitions",
              icon: "🏆",
              description: "Participate in coding, analysis, and gaming competitions with exciting prizes."
            },
            {
              title: "Seminar",
              icon: "🎤",
              description: "Gain insights from industry leaders through engaging and informative seminars."
            },
            {
              title: "Networking",
              icon: "🌐",
              description: "Connect with tech enthusiasts and industry professionals."
            }
          ]
        });
        
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, []);

  // Handle general info changes
  const handleInputChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle about paragraph changes
  const handleParagraphChange = (index, value) => {
    setContent(prev => {
      const newParagraphs = [...prev.aboutParagraphs];
      newParagraphs[index] = value;
      return {
        ...prev,
        aboutParagraphs: newParagraphs
      };
    });
  };

  // Add about paragraph
  const addParagraph = () => {
    setContent(prev => ({
      ...prev,
      aboutParagraphs: [...prev.aboutParagraphs, "New paragraph content goes here."]
    }));
    
    toast.success("New paragraph added successfully!");
  };

  // Remove about paragraph
  const removeParagraph = (index) => {
    if (window.confirm("Are you sure you want to remove this paragraph? This action cannot be undone.")) {
      setContent(prev => {
        const newParagraphs = [...prev.aboutParagraphs];
        newParagraphs.splice(index, 1);
        return {
          ...prev,
          aboutParagraphs: newParagraphs
        };
      });
      
      toast.success("Paragraph removed successfully!");
    }
  };

  // Move paragraph up
  const moveParagraphUp = (index) => {
    if (index === 0) return; // Already at the top
    
    setContent(prev => {
      const newParagraphs = [...prev.aboutParagraphs];
      // Swap with the previous paragraph
      [newParagraphs[index - 1], newParagraphs[index]] = [newParagraphs[index], newParagraphs[index - 1]];
      
      return {
        ...prev,
        aboutParagraphs: newParagraphs
      };
    });
    
    toast.success("Paragraph moved up");
  };

  // Move paragraph down
  const moveParagraphDown = (index) => {
    setContent(prev => {
      const newParagraphs = [...prev.aboutParagraphs];
      
      if (index === newParagraphs.length - 1) return prev; // Already at the bottom
      
      // Swap with the next paragraph
      [newParagraphs[index], newParagraphs[index + 1]] = [newParagraphs[index + 1], newParagraphs[index]];
      
      return {
        ...prev,
        aboutParagraphs: newParagraphs
      };
    });
    
    toast.success("Paragraph moved down");
  };

  // Handle feature changes
  const handleFeatureChange = (index, field, value) => {
    setContent(prev => {
      const newFeatures = [...prev.features];
      newFeatures[index] = { ...newFeatures[index], [field]: value };
      return {
        ...prev,
        features: newFeatures
      };
    });
  };

  // Handle new feature changes
  const handleNewFeatureChange = (field, value) => {
    setNewFeature(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add feature
  const addFeature = () => {
    // Validate new feature data
    if (!newFeature.title.trim()) {
      toast.error("Please enter a title for the new feature");
      return;
    }
    
    if (!newFeature.description.trim()) {
      toast.error("Please enter a description for the new feature");
      return;
    }
    
    // Add the new feature
    setContent(prev => ({
      ...prev,
      features: [...prev.features, { ...newFeature }]
    }));
    
    // Reset the new feature form
    setNewFeature({
      title: "",
      icon: "🏆",
      description: ""
    });
    
    toast.success("New feature added successfully!");
  };

  // Remove feature
  const removeFeature = (index) => {
    if (window.confirm("Are you sure you want to remove this feature? This action cannot be undone.")) {
      setContent(prev => {
        const newFeatures = [...prev.features];
        newFeatures.splice(index, 1);
        return {
          ...prev,
          features: newFeatures
        };
      });
      
      toast.success("Feature removed successfully!");
    }
  };

  // Move feature up
  const moveFeatureUp = (index) => {
    if (index === 0) return; // Already at the top
    
    setContent(prev => {
      const newFeatures = [...prev.features];
      // Swap with the previous feature
      [newFeatures[index - 1], newFeatures[index]] = [newFeatures[index], newFeatures[index - 1]];
      
      return {
        ...prev,
        features: newFeatures
      };
    });
    
    toast.success("Feature moved up");
  };

  // Move feature down
  const moveFeatureDown = (index) => {
    setContent(prev => {
      const newFeatures = [...prev.features];
      
      if (index === newFeatures.length - 1) return prev; // Already at the bottom
      
      // Swap with the next feature
      [newFeatures[index], newFeatures[index + 1]] = [newFeatures[index + 1], newFeatures[index]];
      
      return {
        ...prev,
        features: newFeatures
      };
    });
    
    toast.success("Feature moved down");
  };

  // Save all changes
  const saveContent = async () => {
    try {
      setIsSaving(true);
      
      // Get the current Techelons data first
      const response = await fetch('/api/techelons');
      
      if (!response.ok) {
        throw new Error('Failed to fetch current Techelons data');
      }
      
      const currentData = await response.json();
      
      // Update only the UI content part
      const updatedData = {
        ...currentData,
        uiContent: content
      };
      
      // Save the updated data
      const saveResponse = await fetch('/api/techelons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!saveResponse.ok) {
        throw new Error('Failed to save Techelons content');
      }
      
      toast.success('Techelons content saved successfully');
    } catch (error) {
      console.error('Error saving Techelons content:', error);
      toast.error('Failed to save Techelons content');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading content...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Techelons Content Management</h1>
        <Button 
          onClick={saveContent} 
          disabled={isSaving}
          className="flex items-center"
        >
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
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="general">General Information</TabsTrigger>
          <TabsTrigger value="about">About Section</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>
        
        {/* General Information Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Update the main information displayed on the Techelons page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={content.title} 
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter the main title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea 
                  id="subtitle" 
                  value={content.subtitle} 
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="Enter the subtitle"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="festDate">Fest Date</Label>
                <Input 
                  id="festDate" 
                  value={content.festDate} 
                  onChange={(e) => handleInputChange('festDate', e.target.value)}
                  placeholder="Enter the fest date (e.g., April 2025)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exploreTitle">Explore Section Title</Label>
                <Input 
                  id="exploreTitle" 
                  value={content.exploreTitle} 
                  onChange={(e) => handleInputChange('exploreTitle', e.target.value)}
                  placeholder="Enter the explore section title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exploreDescription">Explore Section Description</Label>
                <Textarea 
                  id="exploreDescription" 
                  value={content.exploreDescription} 
                  onChange={(e) => handleInputChange('exploreDescription', e.target.value)}
                  placeholder="Enter the explore section description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* About Section Tab */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>
                Update the about section content for Techelons.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="aboutTitle">About Section Title</Label>
                <Input 
                  id="aboutTitle" 
                  value={content.aboutTitle} 
                  onChange={(e) => handleInputChange('aboutTitle', e.target.value)}
                  placeholder="Enter the about section title"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <Label>About Paragraphs</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addParagraph}
                    className="flex items-center"
                  >
                    <PlusCircle className="mr-1 h-4 w-4" />
                    Add Paragraph
                  </Button>
                </div>
                
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  {content.aboutParagraphs.map((paragraph, index) => (
                    <div key={index} className="mb-6 pb-6 border-b last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <Label htmlFor={`paragraph-${index}`}>Paragraph {index + 1}</Label>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => moveParagraphUp(index)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => moveParagraphDown(index)}
                            disabled={index === content.aboutParagraphs.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeParagraph(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea 
                        id={`paragraph-${index}`} 
                        value={paragraph} 
                        onChange={(e) => handleParagraphChange(index, e.target.value)}
                        placeholder="Enter paragraph content"
                        rows={4}
                      />
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Features Tab */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Manage the features displayed on the Techelons page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Current Features</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addFeature}
                    className="flex items-center"
                  >
                    <PlusCircle className="mr-1 h-4 w-4" />
                    Add Feature
                  </Button>
                </div>
                
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  {content.features.map((feature, index) => (
                    <div key={index} className="mb-6 pb-6 border-b last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <Label>Feature {index + 1}</Label>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => moveFeatureUp(index)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => moveFeatureDown(index)}
                            disabled={index === content.features.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeFeature(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`feature-title-${index}`}>Title</Label>
                          <Input 
                            id={`feature-title-${index}`} 
                            value={feature.title} 
                            onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                            placeholder="Feature title"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`feature-icon-${index}`}>Icon (Emoji)</Label>
                          <Input 
                            id={`feature-icon-${index}`} 
                            value={feature.icon} 
                            onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                            placeholder="Feature icon (emoji)"
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-3">
                          <Label htmlFor={`feature-description-${index}`}>Description</Label>
                          <Textarea 
                            id={`feature-description-${index}`} 
                            value={feature.description} 
                            onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                            placeholder="Feature description"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label>Add New Feature</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-feature-title">Title</Label>
                    <Input 
                      id="new-feature-title" 
                      value={newFeature.title} 
                      onChange={(e) => handleNewFeatureChange('title', e.target.value)}
                      placeholder="Feature title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-feature-icon">Icon (Emoji)</Label>
                    <Input 
                      id="new-feature-icon" 
                      value={newFeature.icon} 
                      onChange={(e) => handleNewFeatureChange('icon', e.target.value)}
                      placeholder="Feature icon (emoji)"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="new-feature-description">Description</Label>
                    <Textarea 
                      id="new-feature-description" 
                      value={newFeature.description} 
                      onChange={(e) => handleNewFeatureChange('description', e.target.value)}
                      placeholder="Feature description"
                      rows={2}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={addFeature}
                  className="flex items-center"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 