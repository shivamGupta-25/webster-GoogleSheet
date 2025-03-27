"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, PlusCircle, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

export default function TechelonsContentManagement() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

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
    setContent(prev => {
      const newParagraphs = [...prev.aboutParagraphs];
      newParagraphs.splice(index, 1);
      return {
        ...prev,
        aboutParagraphs: newParagraphs
      };
    });

    toast.success("Paragraph removed successfully!");
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
    setContent(prev => {
      const newFeatures = [...prev.features];
      newFeatures.splice(index, 1);
      return {
        ...prev,
        features: newFeatures
      };
    });

    toast.success("Feature removed successfully!");
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
      <div className="flex items-center justify-center min-h-screen p-4">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
        <span className="ml-2 text-base sm:text-lg">Loading content...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="mx-auto text-center text-2xl sm:text-3xl font-bold">Techelons Content Management</h1>
        <Button
          onClick={saveContent}
          disabled={isSaving}
          className="flex items-center w-full sm:w-auto"
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
        <TabsList className="grid grid-cols-3 mb-4 sm:mb-6 w-full">
          <TabsTrigger value="general" className="text-xs sm:text-sm">General Information</TabsTrigger>
          <TabsTrigger value="about" className="text-xs sm:text-sm">About Section</TabsTrigger>
          <TabsTrigger value="features" className="text-xs sm:text-sm">Features</TabsTrigger>
        </TabsList>

        {/* General Information Tab */}
        <TabsContent value="general">
          <Card className="overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">General Information</CardTitle>
              <CardDescription className="text-sm">
                Update the main information displayed on the Techelons page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                <Input
                  id="title"
                  value={content.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter the main title"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle" className="text-sm font-medium">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={content.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="Enter the subtitle"
                  rows={2}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="festDate" className="text-sm font-medium">Fest Date</Label>
                <Input
                  id="festDate"
                  value={content.festDate}
                  onChange={(e) => handleInputChange('festDate', e.target.value)}
                  placeholder="Enter the fest date (e.g., April 2025)"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exploreTitle" className="text-sm font-medium">Explore Section Title</Label>
                <Input
                  id="exploreTitle"
                  value={content.exploreTitle}
                  onChange={(e) => handleInputChange('exploreTitle', e.target.value)}
                  placeholder="Enter the explore section title"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exploreDescription" className="text-sm font-medium">Explore Section Description</Label>
                <Textarea
                  id="exploreDescription"
                  value={content.exploreDescription}
                  onChange={(e) => handleInputChange('exploreDescription', e.target.value)}
                  placeholder="Enter the explore section description"
                  rows={3}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section Tab */}
        <TabsContent value="about">
          <Card className="overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">About Section</CardTitle>
              <CardDescription className="text-sm">
                Update the about section content for Techelons.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="space-y-2">
                <Label htmlFor="aboutTitle" className="text-sm font-medium">About Section Title</Label>
                <Input
                  id="aboutTitle"
                  value={content.aboutTitle}
                  onChange={(e) => handleInputChange('aboutTitle', e.target.value)}
                  placeholder="Enter the about section title"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                  <Label className="text-sm font-medium">About Paragraphs</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addParagraph}
                    className="flex items-center w-full sm:w-auto"
                  >
                    <PlusCircle className="mr-1 h-4 w-4" />
                    Add Paragraph
                  </Button>
                </div>

                <div className="rounded-md border p-3 sm:p-4">
                  {content.aboutParagraphs.map((paragraph, index) => (
                    <div key={index} className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b last:border-0">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                        <Label htmlFor={`paragraph-${index}`} className="mb-1 sm:mb-0 text-sm font-medium">Paragraph {index + 1}</Label>
                        <div className="flex space-x-1 w-full sm:w-auto justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveParagraphUp(index)}
                            disabled={index === 0}
                            className="h-8 w-8"
                            aria-label="Move paragraph up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveParagraphDown(index)}
                            disabled={index === content.aboutParagraphs.length - 1}
                            className="h-8 w-8"
                            aria-label="Move paragraph down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive h-8 w-8"
                                aria-label="Remove paragraph"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the paragraph.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-white" onClick={() => removeParagraph(index)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <Textarea
                        id={`paragraph-${index}`}
                        value={paragraph}
                        onChange={(e) => handleParagraphChange(index, e.target.value)}
                        placeholder="Enter paragraph content"
                        rows={4}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features">
          <Card className="overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">Features</CardTitle>
              <CardDescription className="text-sm">
                Manage the features displayed on the Techelons page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <Label className="text-sm font-medium">Current Features</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addFeature}
                    className="flex items-center w-full sm:w-auto"
                  >
                    <PlusCircle className="mr-1 h-4 w-4" />
                    Add Feature
                  </Button>
                </div>

                <div className="rounded-md border p-3 sm:p-4">
                  {content.features.map((feature, index) => (
                    <div key={index} className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b last:border-0">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                        <Label className="mb-1 sm:mb-0 text-sm font-medium">Feature {index + 1}</Label>
                        <div className="flex space-x-1 w-full sm:w-auto justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveFeatureUp(index)}
                            disabled={index === 0}
                            className="h-8 w-8"
                            aria-label="Move feature up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveFeatureDown(index)}
                            disabled={index === content.features.length - 1}
                            className="h-8 w-8"
                            aria-label="Move feature down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive h-8 w-8"
                                aria-label="Remove feature"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this feature.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-white" onClick={() => removeFeature(index)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`feature-title-${index}`} className="text-sm font-medium">Title</Label>
                          <Input
                            id={`feature-title-${index}`}
                            value={feature.title}
                            onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                            placeholder="Feature title"
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`feature-icon-${index}`} className="text-sm font-medium">Icon (Emoji)</Label>
                          <Input
                            id={`feature-icon-${index}`}
                            value={feature.icon}
                            onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                            placeholder="Feature icon (emoji)"
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                          <Label htmlFor={`feature-description-${index}`} className="text-sm font-medium">Description</Label>
                          <Textarea
                            id={`feature-description-${index}`}
                            value={feature.description}
                            onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                            placeholder="Feature description"
                            rows={2}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4 sm:my-6" />

              <div className="space-y-4">
                <Label className="text-sm font-medium">Add New Feature</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-feature-title" className="text-sm font-medium">Title</Label>
                    <Input
                      id="new-feature-title"
                      value={newFeature.title}
                      onChange={(e) => handleNewFeatureChange('title', e.target.value)}
                      placeholder="Feature title"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-feature-icon" className="text-sm font-medium">Icon (Emoji)</Label>
                    <Input
                      id="new-feature-icon"
                      value={newFeature.icon}
                      onChange={(e) => handleNewFeatureChange('icon', e.target.value)}
                      placeholder="Feature icon (emoji)"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                    <Label htmlFor="new-feature-description" className="text-sm font-medium">Description</Label>
                    <Textarea
                      id="new-feature-description"
                      value={newFeature.description}
                      onChange={(e) => handleNewFeatureChange('description', e.target.value)}
                      placeholder="Feature description"
                      rows={2}
                      className="w-full"
                    />
                  </div>
                </div>

                <Button
                  onClick={addFeature}
                  className="flex items-center w-full sm:w-auto mt-2"
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