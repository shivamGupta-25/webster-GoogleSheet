"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, PlusCircle, ArrowUp, ArrowDown, Trash2, Calendar, MapPin, Users, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageUpload } from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TechelonsManagement() {
  const router = useRouter();
  const [techelonsData, setTechelonsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  // Define placeholder image URLs
  const PLACEHOLDER_IMAGES = {
    event: "https://placehold.co/600x400/333/white?text=Event+Image"
  };
  
  const [newEvent, setNewEvent] = useState({
    id: "",
    name: "",
    shortDescription: "",
    description: "",
    image: PLACEHOLDER_IMAGES.event,
    category: "",
    venue: "",
    festDay: "",
    date: "",
    time: "",
    duration: "",
    registrationStatus: "open",
    teamSize: { min: 1, max: 1 },
    prizes: [{ position: "1st", reward: "Certificate" }],
    coordinators: [{ name: "", email: "", phone: "" }],
    rules: [""],
    instructions: "",
    resources: "",
    whatsappGroup: ""
  });

  // Load techelons data on component mount
  useEffect(() => {
    const fetchTechelonsData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/techelons');
        
        if (response.ok) {
          const data = await response.json();
          setTechelonsData(data);
        } else {
          // If API fails, import directly
          const { 
            festInfo, 
            eventCategories, 
            registrationStatus, 
            festDays, 
            events, 
            whatsappGroups, 
            EVENT_IMAGES 
          } = await import('@/app/_data/techelonsData');
          
          setTechelonsData({
            festInfo,
            eventCategories,
            registrationStatus,
            festDays,
            events,
            whatsappGroups,
            EVENT_IMAGES
          });
        }
      } catch (error) {
        console.error("Error fetching Techelons data:", error);
        toast.error("Failed to load Techelons data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechelonsData();
  }, []);

  // Handle general info changes
  const handleFestInfoChange = (field, value) => {
    console.log(`Updating ${field} to:`, value);
    setTechelonsData(prev => ({
      ...prev,
      festInfo: {
        ...prev.festInfo,
        [field]: value
      }
    }));
  };

  // Handle date changes
  const handleDateChange = (dateType, value) => {
    setTechelonsData(prev => ({
      ...prev,
      festInfo: {
        ...prev.festInfo,
        dates: {
          ...prev.festInfo.dates,
          [dateType]: value
        }
      }
    }));
  };

  // Handle event changes
  const handleEventChange = (index, field, value) => {
    setTechelonsData(prev => {
      const updatedEvents = [...prev.events];
      
      if (field === 'teamSize.min' || field === 'teamSize.max') {
        const [mainField, subField] = field.split('.');
        updatedEvents[index] = {
          ...updatedEvents[index],
          [mainField]: {
            ...updatedEvents[index][mainField],
            [subField]: parseInt(value, 10) || 1
          }
        };
      } else {
        updatedEvents[index] = {
          ...updatedEvents[index],
          [field]: value
        };
      }
      
      return {
        ...prev,
        events: updatedEvents
      };
    });
  };

  // Handle new event changes
  const handleNewEventChange = (field, value) => {
    if (field === 'teamSize.min' || field === 'teamSize.max') {
      const [mainField, subField] = field.split('.');
      setNewEvent(prev => ({
        ...prev,
        [mainField]: {
          ...prev[mainField],
          [subField]: parseInt(value, 10) || 1
        }
      }));
    } else {
      setNewEvent(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Add new event
  const addEvent = () => {
    // Validate required fields
    if (!newEvent.id || !newEvent.name || !newEvent.category || !newEvent.festDay) {
      toast.error("Please fill in all required fields (ID, Name, Category, and Fest Day)");
      return;
    }

    // Check if ID already exists
    if (techelonsData.events.some(event => event.id === newEvent.id)) {
      toast.error("An event with this ID already exists");
      return;
    }

    // Add the new event
    setTechelonsData(prev => ({
      ...prev,
      events: [...prev.events, { ...newEvent }]
    }));

    // Reset the form
    setNewEvent({
      id: "",
      name: "",
      shortDescription: "",
      description: "",
      image: PLACEHOLDER_IMAGES.event,
      category: "",
      venue: "",
      festDay: "",
      date: "",
      time: "",
      duration: "",
      registrationStatus: "open",
      teamSize: { min: 1, max: 1 },
      prizes: [{ position: "1st", reward: "Certificate" }],
      coordinators: [{ name: "", email: "", phone: "" }],
      rules: [""],
      instructions: "",
      resources: "",
      whatsappGroup: ""
    });

    toast.success("Event added successfully");
  };

  // Remove event
  const removeEvent = (index) => {
    if (window.confirm("Are you sure you want to remove this event? This action cannot be undone.")) {
      setTechelonsData(prev => ({
        ...prev,
        events: prev.events.filter((_, i) => i !== index)
      }));
      
      toast.success("Event removed successfully");
    }
  };

  // Save all changes
  const saveTechelonsData = async () => {
    try {
      setIsSaving(true);
      
      // Show loading toast
      const loadingToastId = toast.loading('Saving Techelons data...');
      
      // Send data to API
      const response = await fetch('/api/techelons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(techelonsData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save Techelons data');
      }
      
      // Dismiss loading toast and show success toast
      toast.dismiss(loadingToastId);
      toast.success('Techelons data saved successfully! The changes will be visible after a page refresh.');
      
      // Refresh the page to show updated content
      router.refresh();
    } catch (error) {
      console.error("Error saving Techelons data:", error);
      toast.error(error.message || "There was an error saving your data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset image to placeholder
  const resetImageToPlaceholder = (index) => {
    handleEventChange(index, "image", PLACEHOLDER_IMAGES.event);
    toast.success("Image reset to placeholder");
  };

  // Reset new event image to placeholder
  const resetNewEventImage = () => {
    setNewEvent(prev => ({
      ...prev,
      image: PLACEHOLDER_IMAGES.event
    }));
    toast.success("Image reset to placeholder");
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
          <h1 className="text-3xl font-bold tracking-tight">Techelons Management</h1>
          <p className="text-muted-foreground">
            Manage Techelons fest details, events, and registration settings
          </p>
        </div>
        <Button onClick={saveTechelonsData} disabled={isSaving}>
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

      <Tabs defaultValue="general" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="add-event">Add Event</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Update general Techelons fest information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="registration-enabled"
                  checked={techelonsData.festInfo.registrationEnabled}
                  onCheckedChange={(checked) => handleFestInfoChange("registrationEnabled", checked)}
                />
                <Label htmlFor="registration-enabled">
                  Registration Enabled
                </Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="day1-date">Day 1 Date</Label>
                <Input
                  id="day1-date"
                  value={techelonsData.festInfo.dates.day1}
                  onChange={(e) => handleDateChange("day1", e.target.value)}
                  placeholder="April 10, 2025"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="day2-date">Day 2 Date</Label>
                <Input
                  id="day2-date"
                  value={techelonsData.festInfo.dates.day2}
                  onChange={(e) => handleDateChange("day2", e.target.value)}
                  placeholder="April 11, 2025"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registration-deadline">Registration Deadline</Label>
                <Input
                  id="registration-deadline"
                  value={techelonsData.festInfo.dates.registrationDeadline}
                  onChange={(e) => handleDateChange("registrationDeadline", e.target.value)}
                  placeholder="April 8, 2025"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Events</CardTitle>
              <CardDescription>
                Edit or remove existing Techelons events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8">
                  {techelonsData.events.map((event, index) => (
                    <div key={event.id} className="space-y-4 pb-6 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{event.name}</h3>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeEvent(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`event-id-${index}`}>Event ID (unique identifier)</Label>
                          <Input
                            id={`event-id-${index}`}
                            value={event.id}
                            onChange={(e) => handleEventChange(index, "id", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`event-name-${index}`}>Event Name</Label>
                          <Input
                            id={`event-name-${index}`}
                            value={event.name}
                            onChange={(e) => handleEventChange(index, "name", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`event-short-desc-${index}`}>Short Description</Label>
                          <Input
                            id={`event-short-desc-${index}`}
                            value={event.shortDescription}
                            onChange={(e) => handleEventChange(index, "shortDescription", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`event-category-${index}`}>Category</Label>
                          <Select
                            value={event.category}
                            onValueChange={(value) => handleEventChange(index, "category", value)}
                          >
                            <SelectTrigger id={`event-category-${index}`}>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(techelonsData.eventCategories).map(([key, value]) => (
                                <SelectItem key={key} value={value}>
                                  {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`event-description-${index}`}>Full Description</Label>
                          <Textarea
                            id={`event-description-${index}`}
                            value={event.description}
                            onChange={(e) => handleEventChange(index, "description", e.target.value)}
                            rows={3}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`event-venue-${index}`}>Venue</Label>
                          <Input
                            id={`event-venue-${index}`}
                            value={event.venue}
                            onChange={(e) => handleEventChange(index, "venue", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`event-fest-day-${index}`}>Fest Day</Label>
                          <Select
                            value={event.festDay}
                            onValueChange={(value) => handleEventChange(index, "festDay", value)}
                          >
                            <SelectTrigger id={`event-fest-day-${index}`}>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(techelonsData.festDays).map(([key, value]) => (
                                <SelectItem key={key} value={value}>
                                  {key.replace('_', ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`event-date-${index}`}>Date</Label>
                          <Input
                            id={`event-date-${index}`}
                            value={event.date}
                            onChange={(e) => handleEventChange(index, "date", e.target.value)}
                            placeholder="April 10, 2025"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`event-time-${index}`}>Time</Label>
                          <Input
                            id={`event-time-${index}`}
                            value={event.time}
                            onChange={(e) => handleEventChange(index, "time", e.target.value)}
                            placeholder="10:00 AM"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`event-duration-${index}`}>Duration</Label>
                          <Input
                            id={`event-duration-${index}`}
                            value={event.duration}
                            onChange={(e) => handleEventChange(index, "duration", e.target.value)}
                            placeholder="2 hours"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`event-reg-status-${index}`}>Registration Status</Label>
                          <Select
                            value={event.registrationStatus}
                            onValueChange={(value) => handleEventChange(index, "registrationStatus", value)}
                          >
                            <SelectTrigger id={`event-reg-status-${index}`}>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(techelonsData.registrationStatus).map(([key, value]) => (
                                <SelectItem key={key} value={value}>
                                  {key.replace('_', ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`event-team-min-${index}`}>Min Team Size</Label>
                          <Input
                            id={`event-team-min-${index}`}
                            type="number"
                            min="1"
                            value={event.teamSize?.min || 1}
                            onChange={(e) => handleEventChange(index, "teamSize.min", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`event-team-max-${index}`}>Max Team Size</Label>
                          <Input
                            id={`event-team-max-${index}`}
                            type="number"
                            min="1"
                            value={event.teamSize?.max || 1}
                            onChange={(e) => handleEventChange(index, "teamSize.max", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label>Event Image</Label>
                          <ImageUpload
                            value={event.image}
                            onChange={(url) => handleEventChange(index, "image", url)}
                            onRemove={() => resetImageToPlaceholder(index)}
                          />
                        </div>
                        
                        {/* Additional Fields for Prizes */}
                        <div className="space-y-2 md:col-span-2">
                          <Label>Prizes</Label>
                          <div className="space-y-4 border rounded-md p-4">
                            {event.prizes && event.prizes.map((prize, prizeIndex) => (
                              <div key={prizeIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-200 last:border-0">
                                <div className="space-y-2">
                                  <Label htmlFor={`event-prize-position-${index}-${prizeIndex}`}>Position</Label>
                                  <Input
                                    id={`event-prize-position-${index}-${prizeIndex}`}
                                    value={prize.position}
                                    onChange={(e) => {
                                      const updatedPrizes = [...event.prizes];
                                      updatedPrizes[prizeIndex] = {
                                        ...updatedPrizes[prizeIndex],
                                        position: e.target.value
                                      };
                                      handleEventChange(index, "prizes", updatedPrizes);
                                    }}
                                    placeholder="1st"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`event-prize-reward-${index}-${prizeIndex}`}>Reward</Label>
                                  <Input
                                    id={`event-prize-reward-${index}-${prizeIndex}`}
                                    value={prize.reward}
                                    onChange={(e) => {
                                      const updatedPrizes = [...event.prizes];
                                      updatedPrizes[prizeIndex] = {
                                        ...updatedPrizes[prizeIndex],
                                        reward: e.target.value
                                      };
                                      handleEventChange(index, "prizes", updatedPrizes);
                                    }}
                                    placeholder="₹5,000 + Certificate"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => {
                                      const updatedPrizes = event.prizes.filter((_, i) => i !== prizeIndex);
                                      handleEventChange(index, "prizes", updatedPrizes);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Remove Prize
                                  </Button>
                                </div>
                              </div>
                            ))}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const updatedPrizes = [...(event.prizes || []), { position: "", reward: "" }];
                                handleEventChange(index, "prizes", updatedPrizes);
                              }}
                            >
                              <PlusCircle className="h-4 w-4 mr-1" />
                              Add Prize
                            </Button>
                          </div>
                        </div>
                        
                        {/* Additional Fields for Coordinators */}
                        <div className="space-y-2 md:col-span-2">
                          <Label>Coordinators</Label>
                          <div className="space-y-4 border rounded-md p-4">
                            {event.coordinators && event.coordinators.map((coordinator, coordIndex) => (
                              <div key={coordIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-200 last:border-0">
                                <div className="space-y-2">
                                  <Label htmlFor={`event-coord-name-${index}-${coordIndex}`}>Name</Label>
                                  <Input
                                    id={`event-coord-name-${index}-${coordIndex}`}
                                    value={coordinator.name}
                                    onChange={(e) => {
                                      const updatedCoordinators = [...event.coordinators];
                                      updatedCoordinators[coordIndex] = {
                                        ...updatedCoordinators[coordIndex],
                                        name: e.target.value
                                      };
                                      handleEventChange(index, "coordinators", updatedCoordinators);
                                    }}
                                    placeholder="John Doe"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`event-coord-email-${index}-${coordIndex}`}>Email</Label>
                                  <Input
                                    id={`event-coord-email-${index}-${coordIndex}`}
                                    value={coordinator.email}
                                    onChange={(e) => {
                                      const updatedCoordinators = [...event.coordinators];
                                      updatedCoordinators[coordIndex] = {
                                        ...updatedCoordinators[coordIndex],
                                        email: e.target.value
                                      };
                                      handleEventChange(index, "coordinators", updatedCoordinators);
                                    }}
                                    placeholder="john.doe@example.com"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`event-coord-phone-${index}-${coordIndex}`}>Phone</Label>
                                  <Input
                                    id={`event-coord-phone-${index}-${coordIndex}`}
                                    value={coordinator.phone}
                                    onChange={(e) => {
                                      const updatedCoordinators = [...event.coordinators];
                                      updatedCoordinators[coordIndex] = {
                                        ...updatedCoordinators[coordIndex],
                                        phone: e.target.value
                                      };
                                      handleEventChange(index, "coordinators", updatedCoordinators);
                                    }}
                                    placeholder="9876543210"
                                  />
                                </div>
                                <div className="md:col-span-3">
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => {
                                      const updatedCoordinators = event.coordinators.filter((_, i) => i !== coordIndex);
                                      handleEventChange(index, "coordinators", updatedCoordinators);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Remove Coordinator
                                  </Button>
                                </div>
                              </div>
                            ))}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const updatedCoordinators = [...(event.coordinators || []), { name: "", email: "", phone: "" }];
                                handleEventChange(index, "coordinators", updatedCoordinators);
                              }}
                            >
                              <PlusCircle className="h-4 w-4 mr-1" />
                              Add Coordinator
                            </Button>
                          </div>
                        </div>
                        
                        {/* Additional Fields for Rules */}
                        <div className="space-y-2 md:col-span-2">
                          <Label>Rules</Label>
                          <div className="space-y-4 border rounded-md p-4">
                            {event.rules && event.rules.map((rule, ruleIndex) => (
                              <div key={ruleIndex} className="flex items-center gap-2 pb-2">
                                <Input
                                  value={rule}
                                  onChange={(e) => {
                                    const updatedRules = [...event.rules];
                                    updatedRules[ruleIndex] = e.target.value;
                                    handleEventChange(index, "rules", updatedRules);
                                  }}
                                  placeholder="Rule description"
                                />
                                <Button 
                                  variant="destructive" 
                                  size="icon"
                                  onClick={() => {
                                    const updatedRules = event.rules.filter((_, i) => i !== ruleIndex);
                                    handleEventChange(index, "rules", updatedRules);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const updatedRules = [...(event.rules || []), ""];
                                handleEventChange(index, "rules", updatedRules);
                              }}
                            >
                              <PlusCircle className="h-4 w-4 mr-1" />
                              Add Rule
                            </Button>
                          </div>
                        </div>
                        
                        {/* Additional Fields for Instructions */}
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`event-instructions-${index}`}>Instructions</Label>
                          <Textarea
                            id={`event-instructions-${index}`}
                            value={event.instructions || ""}
                            onChange={(e) => handleEventChange(index, "instructions", e.target.value)}
                            rows={2}
                            placeholder="Please bring your college ID and registration confirmation"
                          />
                        </div>
                        
                        {/* Additional Fields for Resources */}
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`event-resources-${index}`}>Resources</Label>
                          <Textarea
                            id={`event-resources-${index}`}
                            value={event.resources || ""}
                            onChange={(e) => handleEventChange(index, "resources", e.target.value)}
                            rows={2}
                            placeholder="Recommended reading: Latest trends in AI and Cybersecurity"
                          />
                        </div>
                        
                        {/* Additional Field for WhatsApp Group */}
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`event-whatsapp-${index}`}>WhatsApp Group Link</Label>
                          <Input
                            id={`event-whatsapp-${index}`}
                            value={event.whatsappGroup || ""}
                            onChange={(e) => handleEventChange(index, "whatsappGroup", e.target.value)}
                            placeholder="https://chat.whatsapp.com/..."
                          />
                        </div>
                        
                        {/* Speaker field for seminar events */}
                        {event.category === "seminar" && (
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor={`event-speaker-${index}`}>Speaker</Label>
                            <Input
                              id={`event-speaker-${index}`}
                              value={event.speaker || ""}
                              onChange={(e) => handleEventChange(index, "speaker", e.target.value)}
                              placeholder="Dr. John Doe, University of Example"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Event Tab */}
        <TabsContent value="add-event" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Event</CardTitle>
              <CardDescription>
                Create a new event for Techelons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-event-id">Event ID (unique identifier)*</Label>
                  <Input
                    id="new-event-id"
                    value={newEvent.id}
                    onChange={(e) => handleNewEventChange("id", e.target.value)}
                    placeholder="e.g., coding-competition"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-event-name">Event Name*</Label>
                  <Input
                    id="new-event-name"
                    value={newEvent.name}
                    onChange={(e) => handleNewEventChange("name", e.target.value)}
                    placeholder="e.g., Coding Competition"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-event-short-desc">Short Description</Label>
                  <Input
                    id="new-event-short-desc"
                    value={newEvent.shortDescription}
                    onChange={(e) => handleNewEventChange("shortDescription", e.target.value)}
                    placeholder="Brief description for event cards"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-event-category">Category*</Label>
                  <Select
                    value={newEvent.category}
                    onValueChange={(value) => handleNewEventChange("category", value)}
                  >
                    <SelectTrigger id="new-event-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(techelonsData.eventCategories).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="new-event-description">Full Description</Label>
                  <Textarea
                    id="new-event-description"
                    value={newEvent.description}
                    onChange={(e) => handleNewEventChange("description", e.target.value)}
                    placeholder="Detailed description of the event"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-event-venue">Venue</Label>
                  <Input
                    id="new-event-venue"
                    value={newEvent.venue}
                    onChange={(e) => handleNewEventChange("venue", e.target.value)}
                    placeholder="e.g., Main Auditorium"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-event-fest-day">Fest Day*</Label>
                  <Select
                    value={newEvent.festDay}
                    onValueChange={(value) => handleNewEventChange("festDay", value)}
                  >
                    <SelectTrigger id="new-event-fest-day">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(techelonsData.festDays).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {key.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-event-date">Date</Label>
                  <Input
                    id="new-event-date"
                    value={newEvent.date}
                    onChange={(e) => handleNewEventChange("date", e.target.value)}
                    placeholder="April 10, 2025"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-event-time">Time</Label>
                  <Input
                    id="new-event-time"
                    value={newEvent.time}
                    onChange={(e) => handleNewEventChange("time", e.target.value)}
                    placeholder="10:00 AM"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-event-duration">Duration</Label>
                  <Input
                    id="new-event-duration"
                    value={newEvent.duration}
                    onChange={(e) => handleNewEventChange("duration", e.target.value)}
                    placeholder="2 hours"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-event-reg-status">Registration Status</Label>
                  <Select
                    value={newEvent.registrationStatus}
                    onValueChange={(value) => handleNewEventChange("registrationStatus", value)}
                  >
                    <SelectTrigger id="new-event-reg-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(techelonsData.registrationStatus).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {key.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-event-team-min">Min Team Size</Label>
                  <Input
                    id="new-event-team-min"
                    type="number"
                    min="1"
                    value={newEvent.teamSize.min}
                    onChange={(e) => handleNewEventChange("teamSize.min", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-event-team-max">Max Team Size</Label>
                  <Input
                    id="new-event-team-max"
                    type="number"
                    min="1"
                    value={newEvent.teamSize.max}
                    onChange={(e) => handleNewEventChange("teamSize.max", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label>Event Image</Label>
                  <ImageUpload
                    value={newEvent.image}
                    onChange={(url) => handleNewEventChange("image", url)}
                    onRemove={resetNewEventImage}
                  />
                </div>
                
                {/* Additional Fields for Prizes */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Prizes</Label>
                  <div className="space-y-4 border rounded-md p-4">
                    {newEvent.prizes && newEvent.prizes.map((prize, prizeIndex) => (
                      <div key={prizeIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-200 last:border-0">
                        <div className="space-y-2">
                          <Label htmlFor={`new-event-prize-position-${prizeIndex}`}>Position</Label>
                          <Input
                            id={`new-event-prize-position-${prizeIndex}`}
                            value={prize.position}
                            onChange={(e) => {
                              const updatedPrizes = [...newEvent.prizes];
                              updatedPrizes[prizeIndex] = {
                                ...updatedPrizes[prizeIndex],
                                position: e.target.value
                              };
                              handleNewEventChange("prizes", updatedPrizes);
                            }}
                            placeholder="1st"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`new-event-prize-reward-${prizeIndex}`}>Reward</Label>
                          <Input
                            id={`new-event-prize-reward-${prizeIndex}`}
                            value={prize.reward}
                            onChange={(e) => {
                              const updatedPrizes = [...newEvent.prizes];
                              updatedPrizes[prizeIndex] = {
                                ...updatedPrizes[prizeIndex],
                                reward: e.target.value
                              };
                              handleNewEventChange("prizes", updatedPrizes);
                            }}
                            placeholder="₹5,000 + Certificate"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              const updatedPrizes = newEvent.prizes.filter((_, i) => i !== prizeIndex);
                              handleNewEventChange("prizes", updatedPrizes);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove Prize
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const updatedPrizes = [...(newEvent.prizes || []), { position: "", reward: "" }];
                        handleNewEventChange("prizes", updatedPrizes);
                      }}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Prize
                    </Button>
                  </div>
                </div>
                
                {/* Additional Fields for Coordinators */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Coordinators</Label>
                  <div className="space-y-4 border rounded-md p-4">
                    {newEvent.coordinators && newEvent.coordinators.map((coordinator, coordIndex) => (
                      <div key={coordIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-200 last:border-0">
                        <div className="space-y-2">
                          <Label htmlFor={`new-event-coord-name-${coordIndex}`}>Name</Label>
                          <Input
                            id={`new-event-coord-name-${coordIndex}`}
                            value={coordinator.name}
                            onChange={(e) => {
                              const updatedCoordinators = [...newEvent.coordinators];
                              updatedCoordinators[coordIndex] = {
                                ...updatedCoordinators[coordIndex],
                                name: e.target.value
                              };
                              handleNewEventChange("coordinators", updatedCoordinators);
                            }}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`new-event-coord-email-${coordIndex}`}>Email</Label>
                          <Input
                            id={`new-event-coord-email-${coordIndex}`}
                            value={coordinator.email}
                            onChange={(e) => {
                              const updatedCoordinators = [...newEvent.coordinators];
                              updatedCoordinators[coordIndex] = {
                                ...updatedCoordinators[coordIndex],
                                email: e.target.value
                              };
                              handleNewEventChange("coordinators", updatedCoordinators);
                            }}
                            placeholder="john.doe@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`new-event-coord-phone-${coordIndex}`}>Phone</Label>
                          <Input
                            id={`new-event-coord-phone-${coordIndex}`}
                            value={coordinator.phone}
                            onChange={(e) => {
                              const updatedCoordinators = [...newEvent.coordinators];
                              updatedCoordinators[coordIndex] = {
                                ...updatedCoordinators[coordIndex],
                                phone: e.target.value
                              };
                              handleNewEventChange("coordinators", updatedCoordinators);
                            }}
                            placeholder="9876543210"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              const updatedCoordinators = newEvent.coordinators.filter((_, i) => i !== coordIndex);
                              handleNewEventChange("coordinators", updatedCoordinators);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove Coordinator
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const updatedCoordinators = [...(newEvent.coordinators || []), { name: "", email: "", phone: "" }];
                        handleNewEventChange("coordinators", updatedCoordinators);
                      }}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Coordinator
                    </Button>
                  </div>
                </div>
                
                {/* Additional Fields for Rules */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Rules</Label>
                  <div className="space-y-4 border rounded-md p-4">
                    {newEvent.rules && newEvent.rules.map((rule, ruleIndex) => (
                      <div key={ruleIndex} className="flex items-center gap-2 pb-2">
                        <Input
                          value={rule}
                          onChange={(e) => {
                            const updatedRules = [...newEvent.rules];
                            updatedRules[ruleIndex] = e.target.value;
                            handleNewEventChange("rules", updatedRules);
                          }}
                          placeholder="Rule description"
                        />
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => {
                            const updatedRules = newEvent.rules.filter((_, i) => i !== ruleIndex);
                            handleNewEventChange("rules", updatedRules);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const updatedRules = [...(newEvent.rules || []), ""];
                        handleNewEventChange("rules", updatedRules);
                      }}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Rule
                    </Button>
                  </div>
                </div>
                
                {/* Additional Fields for Instructions */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="new-event-instructions">Instructions</Label>
                  <Textarea
                    id="new-event-instructions"
                    value={newEvent.instructions || ""}
                    onChange={(e) => handleNewEventChange("instructions", e.target.value)}
                    rows={2}
                    placeholder="Please bring your college ID and registration confirmation"
                  />
                </div>
                
                {/* Additional Fields for Resources */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="new-event-resources">Resources</Label>
                  <Textarea
                    id="new-event-resources"
                    value={newEvent.resources || ""}
                    onChange={(e) => handleNewEventChange("resources", e.target.value)}
                    rows={2}
                    placeholder="Recommended reading: Latest trends in AI and Cybersecurity"
                  />
                </div>
                
                {/* Additional Field for WhatsApp Group */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="new-event-whatsapp">WhatsApp Group Link</Label>
                  <Input
                    id="new-event-whatsapp"
                    value={newEvent.whatsappGroup || ""}
                    onChange={(e) => handleNewEventChange("whatsappGroup", e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                  />
                </div>
                
                {/* Speaker field for seminar events */}
                {newEvent.category === "seminar" && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="new-event-speaker">Speaker</Label>
                    <Input
                      id="new-event-speaker"
                      value={newEvent.speaker || ""}
                      onChange={(e) => handleNewEventChange("speaker", e.target.value)}
                      placeholder="Dr. John Doe, University of Example"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Button onClick={addEvent} className="w-full">
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