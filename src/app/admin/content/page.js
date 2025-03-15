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
import toast from "react-hot-toast";
import Image from "next/image";
import { ImageUpload } from "@/components/ui/image-upload";

export default function ContentManagement() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    image: "",
    linkedin: null
  });

  const [newEvent, setNewEvent] = useState({
    title: "",
    imageUrl: ""
  });

  // Load content on component mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        
        const data = await response.json();
        setContent(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching content:', error);
        toast.error('Failed to load content');
        setIsLoading(false);
        
        // If we can't fetch from API, initialize with empty structure
        setContent({
          banner: {
            title: "",
            subtitle: "",
            logoImage: ""
          },
          about: {
            title: "",
            paragraphs: []
          },
          council: {
            title: "",
            description: "",
            members: []
          },
          pastEvents: {
            title: "",
            description: "",
            events: []
          }
        });
      }
    };
    
    fetchContent();
  }, []);

  const handleInputChange = (section, field, value) => {
    setContent((prevContent) => ({
      ...prevContent,
      [section]: {
        ...prevContent[section],
        [field]: value,
      },
    }));
  };

  const handleParagraphChange = (index, value) => {
    setContent((prevContent) => {
      const newParagraphs = [...prevContent.about.paragraphs];
      newParagraphs[index] = { ...newParagraphs[index], content: value };
      return {
        ...prevContent,
        about: {
          ...prevContent.about,
          paragraphs: newParagraphs,
        },
      };
    });
  };

  const addParagraph = () => {
    setContent((prevContent) => {
      // Find the highest ID to ensure uniqueness
      const highestId = Math.max(...prevContent.about.paragraphs.map(p => p.id), 0);
      const newId = highestId + 1;
      
      return {
        ...prevContent,
        about: {
          ...prevContent.about,
          paragraphs: [
            ...prevContent.about.paragraphs,
            {
              id: newId,
              content: "New paragraph content goes here."
            }
          ],
        },
      };
    });
    
    toast.success("New paragraph added successfully!");
  };

  const removeParagraph = (index) => {
    if (window.confirm("Are you sure you want to remove this paragraph? This action cannot be undone.")) {
      setContent((prevContent) => {
        const newParagraphs = [...prevContent.about.paragraphs];
        newParagraphs.splice(index, 1);
        return {
          ...prevContent,
          about: {
            ...prevContent.about,
            paragraphs: newParagraphs,
          },
        };
      });
      
      toast.success("Paragraph removed successfully!");
    }
  };

  const moveParagraphUp = (index) => {
    if (index === 0) return; // Already at the top
    
    setContent((prevContent) => {
      const newParagraphs = [...prevContent.about.paragraphs];
      // Swap with the previous paragraph
      [newParagraphs[index - 1], newParagraphs[index]] = [newParagraphs[index], newParagraphs[index - 1]];
      
      return {
        ...prevContent,
        about: {
          ...prevContent.about,
          paragraphs: newParagraphs,
        },
      };
    });
    
    toast.success("Paragraph moved up");
  };

  const moveParagraphDown = (index) => {
    setContent((prevContent) => {
      const newParagraphs = [...prevContent.about.paragraphs];
      
      if (index === newParagraphs.length - 1) return prevContent; // Already at the bottom
      
      // Swap with the next paragraph
      [newParagraphs[index], newParagraphs[index + 1]] = [newParagraphs[index + 1], newParagraphs[index]];
      
      return {
        ...prevContent,
        about: {
          ...prevContent.about,
          paragraphs: newParagraphs,
        },
      };
    });
    
    toast.success("Paragraph moved down");
  };

  const handleNewMemberChange = (field, value) => {
    setNewMember(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCouncilMember = () => {
    // Validate new member data
    if (!newMember.name.trim()) {
      toast.error("Please enter a name for the new member");
      return;
    }
    
    if (!newMember.role.trim()) {
      toast.error("Please enter a role for the new member");
      return;
    }
    
    // Add the new member to the council
    setContent((prevContent) => ({
      ...prevContent,
      council: {
        ...prevContent.council,
        members: [
          ...prevContent.council.members,
          { ...newMember }
        ],
      },
    }));
    
    // Reset the new member form
    setNewMember({
      name: "",
      role: "",
      image: "",
      linkedin: null
    });
    
    toast.success("New council member added successfully!");
  };

  const removeCouncilMember = (index) => {
    if (window.confirm("Are you sure you want to remove this council member? This action cannot be undone.")) {
      setContent((prevContent) => {
        const newMembers = [...prevContent.council.members];
        newMembers.splice(index, 1);
        return {
          ...prevContent,
          council: {
            ...prevContent.council,
            members: newMembers,
          },
        };
      });
      
      toast.success("Council member removed successfully!");
    }
  };

  const handleCouncilMemberChange = (index, field, value) => {
    setContent((prevContent) => {
      const newMembers = [...prevContent.council.members];
      newMembers[index] = { ...newMembers[index], [field]: value };
      return {
        ...prevContent,
        council: {
          ...prevContent.council,
          members: newMembers,
        },
      };
    });
  };

  const handleEventChange = (index, field, value) => {
    setContent((prevContent) => {
      const newEvents = [...prevContent.pastEvents.events];
      newEvents[index] = { ...newEvents[index], [field]: value };
      return {
        ...prevContent,
        pastEvents: {
          ...prevContent.pastEvents,
          events: newEvents,
        },
      };
    });
  };

  const handleNewEventChange = (field, value) => {
    setNewEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetNewEventImage = () => {
    setNewEvent(prev => ({
      ...prev,
      imageUrl: ""
    }));
    toast.success("Event image removed");
  };

  const addEvent = () => {
    // Validate new event data
    if (!newEvent.title.trim()) {
      toast.error("Please enter a title for the new event");
      return;
    }

    // Create the new event object
    const newEventData = {
      title: newEvent.title.trim(),
      imageUrl: newEvent.imageUrl
    };

    // Add the new event to the events list
    setContent((prevContent) => {
      if (!prevContent.pastEvents) {
        console.error('pastEvents is undefined in content');
        return prevContent;
      }

      return {
        ...prevContent,
        pastEvents: {
          ...prevContent.pastEvents,
          events: [
            ...(prevContent.pastEvents.events || []),
            newEventData
          ],
        },
      };
    });
    
    // Reset the new event form
    setNewEvent({
      title: "",
      imageUrl: ""
    });
    
    toast.success("New event added successfully!");
  };

  const removeEvent = (index) => {
    if (window.confirm("Are you sure you want to remove this event? This action cannot be undone.")) {
      setContent((prevContent) => {
        const newEvents = [...prevContent.pastEvents.events];
        newEvents.splice(index, 1);
        return {
          ...prevContent,
          pastEvents: {
            ...prevContent.pastEvents,
            events: newEvents,
          },
        };
      });
      
      toast.success("Event removed successfully!");
    }
  };

  const saveContent = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save content');
      }
      
      toast.success('Content saved successfully');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  // Function to reset an image to placeholder
  const resetImageToPlaceholder = (section, field) => {
    handleInputChange(section, field, "");
    toast.success(`${field} image removed`);
  };

  // Function to reset new member image to placeholder
  const resetNewMemberImage = () => {
    setNewMember(prev => ({
      ...prev,
      image: ""
    }));
    toast.success("Member image removed");
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your website's content and settings
          </p>
        </div>
        <Button onClick={saveContent} disabled={isSaving} className="w-full sm:w-auto">
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

      <Tabs defaultValue="banner" className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid w-full grid-cols-4 min-w-[300px] max-w-full lg:w-[400px]">
            <TabsTrigger value="banner">Banner</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="council">Council</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="banner" className="space-y-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Banner Section</CardTitle>
              <CardDescription>
                Update the main banner content and images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bannerTitle">Banner Title</Label>
                <Input
                  id="bannerTitle"
                  value={content.banner.title}
                  onChange={(e) => handleInputChange("banner", "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bannerSubtitle">Banner Subtitle</Label>
                <Input
                  id="bannerSubtitle"
                  value={content.banner.subtitle}
                  onChange={(e) => handleInputChange("banner", "subtitle", e.target.value)}
                />
              </div>
              <div className="space-y-2 max-w-full">
                <Label>Banner Image</Label>
                <ImageUpload
                  value={content.banner.logoImage}
                  onChange={(url) => handleInputChange("banner", "logoImage", url)}
                  onRemove={() => resetImageToPlaceholder("banner", "logoImage")}
                  previewWidth={300}
                  aspectRatio="3:4"
                  className="w-full"
                  description="Upload a banner image (3:4 aspect ratio recommended)"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>
                Manage the about section content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aboutTitle">About Title</Label>
                <Input
                  id="aboutTitle"
                  value={content.about.title}
                  onChange={(e) => handleInputChange("about", "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>About Paragraphs</Label>
                <div className="space-y-4 rounded-md border p-2 sm:p-4">
                  <div className="space-y-4">
                    {content.about.paragraphs.map((paragraph, index) => (
                      <div key={paragraph.id} className="space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveParagraphUp(index)}
                              disabled={index === 0}
                              className="h-8 w-8"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveParagraphDown(index)}
                              disabled={index === content.about.paragraphs.length - 1}
                              className="h-8 w-8"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="text-xs text-muted-foreground">Paragraph {index + 1}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeParagraph(index)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={paragraph.content}
                          onChange={(e) => handleParagraphChange(index, e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={addParagraph}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Paragraph
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="council" className="space-y-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Council Members</CardTitle>
              <CardDescription>
                Manage council member information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {content.council.members.map((member, index) => (
                  <Card key={index}>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "3/4" }}>
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={member.name}
                            onChange={(e) => handleCouncilMemberChange(index, "name", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Input
                            value={member.role}
                            onChange={(e) => handleCouncilMemberChange(index, "role", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>LinkedIn URL</Label>
                          <Input
                            value={member.linkedin || ""}
                            onChange={(e) => handleCouncilMemberChange(index, "linkedin", e.target.value)}
                          />
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => removeCouncilMember(index)}
                          className="w-full"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Member
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add New Member</h3>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={newMember.name}
                      onChange={(e) => handleNewMemberChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={newMember.role}
                      onChange={(e) => handleNewMemberChange("role", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn URL</Label>
                    <Input
                      value={newMember.linkedin || ""}
                      onChange={(e) => handleNewMemberChange("linkedin", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Profile Image</Label>
                    <ImageUpload
                      value={newMember.image}
                      onChange={(url) => handleNewMemberChange("image", url)}
                      onRemove={() => resetNewMemberImage()}
                      previewWidth={200}
                      aspectRatio="3:4"
                      description="Upload a profile image (3:4 aspect ratio recommended)"
                    />
                  </div>
                </div>
                <Button
                  onClick={addCouncilMember}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Past Events</CardTitle>
              <CardDescription>
                Manage past event information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {content.pastEvents.events.map((event, index) => (
                  <Card key={index}>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "16/9" }}>
                          {event.imageUrl && (
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={event.title}
                            onChange={(e) => handleEventChange(index, "title", e.target.value)}
                          />
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => removeEvent(index)}
                          className="w-full"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Event
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add New Event</h3>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={newEvent.title}
                      onChange={(e) => handleNewEventChange("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Event Image</Label>
                    <ImageUpload
                      value={newEvent.imageUrl}
                      onChange={(url) => handleNewEventChange("imageUrl", url)}
                      onRemove={() => resetNewEventImage()}
                      previewWidth={300}
                      aspectRatio="16:9"
                      description="Upload an event image (16:9 aspect ratio recommended)"
                    />
                  </div>
                </div>
                <Button
                  onClick={addEvent}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 