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

export default function ContentManagement() {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("banner");
  
  // Define placeholder image URLs
  const PLACEHOLDER_IMAGES = {
    banner: "https://placehold.co/600x400/333/white?text=Banner+Logo",
    profile: "https://placehold.co/300x300/333/white?text=Profile+Photo",
    event: "https://placehold.co/600x400/333/white?text=Event+Image"
  };
  
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    image: PLACEHOLDER_IMAGES.profile,
    linkedin: null
  });

  const [newEvent, setNewEvent] = useState({
    title: "",
    imageUrl: PLACEHOLDER_IMAGES.event
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
            institution: "",
            description: "",
            buttonText: "",
            buttonLink: "",
            logoImage: PLACEHOLDER_IMAGES.banner
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
          },
          workshop: {
            title: "",
            shortDescription: "",
            isRegistrationOpen: true,
            formSubmittedLink: "",
            details: [],
            bannerImage: PLACEHOLDER_IMAGES.event,
            whatsappGroupLink: "",
            socialMedia: {
              instagram: "",
              linkedin: ""
            },
            emailNotification: {
              subject: ""
            }
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
      image: PLACEHOLDER_IMAGES.profile,
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

  const resetNewEventImage = (placeholderPath) => {
    setNewEvent(prev => ({
      ...prev,
      imageUrl: placeholderPath
    }));
    toast.success("Event image reset to placeholder");
  };

  const addEvent = () => {
    // Validate new event data
    if (!newEvent.title.trim()) {
      toast.error("Please enter a title for the new event");
      return;
    }

    if (!newEvent.imageUrl || newEvent.imageUrl === PLACEHOLDER_IMAGES.event) {
      toast.error("Please upload an image for the event");
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

      const updatedContent = {
        ...prevContent,
        pastEvents: {
          ...prevContent.pastEvents,
          events: [
            ...(prevContent.pastEvents.events || []),
            newEventData
          ],
        },
      };

      console.log('Updated content:', updatedContent);
      return updatedContent;
    });
    
    // Reset the new event form
    setNewEvent({
      title: "",
      imageUrl: PLACEHOLDER_IMAGES.event
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
  const resetImageToPlaceholder = (section, field, placeholderPath) => {
    handleInputChange(section, field, placeholderPath);
    toast.success(`${field} reset to placeholder image`);
  };

  // Function to reset new member image to placeholder
  const resetNewMemberImage = (placeholderPath) => {
    setNewMember(prev => ({
      ...prev,
      image: placeholderPath
    }));
    toast.success("Member image reset to placeholder");
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
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">
            Manage your website's content and settings
          </p>
        </div>
        <Button onClick={saveContent} disabled={isSaving}>
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
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="banner">Banner</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="council">Council</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="banner" className="space-y-4">
          <Card>
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
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <ImageUpload
                  value={content.banner.image}
                  onChange={(url) => handleInputChange("banner", "image", url)}
                  onRemove={() => resetImageToPlaceholder("banner", "image", PLACEHOLDER_IMAGES.banner)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
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
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  <div className="space-y-4">
                    {content.about.paragraphs.map((paragraph, index) => (
                      <div key={paragraph.id} className="space-y-2">
                        <div className="flex items-center gap-2">
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
                            disabled={index === content.about.paragraphs.length - 1}
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
                        <Textarea
                          value={paragraph.content}
                          onChange={(e) => handleParagraphChange(index, e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
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
          <Card>
            <CardHeader>
              <CardTitle>Council Members</CardTitle>
              <CardDescription>
                Manage council member information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {content.council.members.map((member, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
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
                <div className="grid gap-4 md:grid-cols-2">
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
                      onRemove={() => resetNewMemberImage(PLACEHOLDER_IMAGES.profile)}
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
          <Card>
            <CardHeader>
              <CardTitle>Past Events</CardTitle>
              <CardDescription>
                Manage past event information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {content.pastEvents.events.map((event, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
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
                <div className="grid gap-4 md:grid-cols-2">
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
                      onRemove={() => resetNewEventImage(PLACEHOLDER_IMAGES.event)}
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