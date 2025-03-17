import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { PlusCircle, Trash2 } from "lucide-react";

export default function EventForm({ 
  event, 
  onChange, 
  techelonsData, 
  resetImage,
  isNewEvent = false
}) {
  // Handle array field changes (rules, prizes, coordinators, etc.)
  const handleArrayFieldChange = (field, index, value, subField = null) => {
    const updatedArray = [...event[field]];
    
    if (subField) {
      updatedArray[index] = {
        ...updatedArray[index],
        [subField]: value
      };
    } else {
      updatedArray[index] = value;
    }
    
    onChange(field, updatedArray);
  };

  // Add item to array field
  const addArrayItem = (field, template) => {
    const updatedArray = [...(event[field] || []), template];
    onChange(field, updatedArray);
  };

  // Remove item from array field
  const removeArrayItem = (field, index) => {
    const updatedArray = event[field].filter((_, i) => i !== index);
    onChange(field, updatedArray);
  };

  return (
    <div className="space-y-6 max-w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event-id" className="text-sm">Event ID (unique identifier)*</Label>
          <Input
            id="event-id"
            value={event.id}
            onChange={(e) => onChange("id", e.target.value)}
            placeholder="e.g., coding-competition"
            required
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="event-name" className="text-sm">Event Name*</Label>
          <Input
            id="event-name"
            value={event.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g., Coding Competition"
            required
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="event-short-desc" className="text-sm">Short Description</Label>
          <Input
            id="event-short-desc"
            value={event.shortDescription}
            onChange={(e) => onChange("shortDescription", e.target.value)}
            placeholder="Brief description for event cards"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="event-tagline" className="text-sm">Tagline</Label>
          <Input
            id="event-tagline"
            value={event.tagline || ""}
            onChange={(e) => onChange("tagline", e.target.value)}
            placeholder="Catchy tagline for the event"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="event-category" className="text-sm">Category*</Label>
          <Select
            value={event.category}
            onValueChange={(value) => onChange("category", value)}
          >
            <SelectTrigger id="event-category" className="w-full">
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
        
        <div className="space-y-2">
          <Label htmlFor="event-venue" className="text-sm">Venue</Label>
          <Input
            id="event-venue"
            value={event.venue}
            onChange={(e) => onChange("venue", e.target.value)}
            placeholder="e.g., Main Auditorium"
            className="w-full"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="event-description" className="text-sm">Full Description</Label>
        <Textarea
          id="event-description"
          value={event.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Detailed description of the event"
          rows={3}
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event-fest-day" className="text-sm">Fest Day*</Label>
          <Select
            value={event.festDay}
            onValueChange={(value) => onChange("festDay", value)}
          >
            <SelectTrigger id="event-fest-day" className="w-full">
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
          <Label htmlFor="event-date" className="text-sm">Date</Label>
          <Input
            id="event-date"
            value={event.date}
            onChange={(e) => onChange("date", e.target.value)}
            placeholder="April 10, 2025"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="event-time" className="text-sm">Time</Label>
          <Input
            id="event-time"
            value={event.time}
            onChange={(e) => onChange("time", e.target.value)}
            placeholder="10:00 AM"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="event-duration" className="text-sm">Duration</Label>
          <Input
            id="event-duration"
            value={event.duration}
            onChange={(e) => onChange("duration", e.target.value)}
            placeholder="2 hours"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="event-reg-status" className="text-sm">Registration Status</Label>
          <Select
            value={event.registrationStatus}
            onValueChange={(value) => onChange("registrationStatus", value)}
          >
            <SelectTrigger id="event-reg-status" className="w-full">
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
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event-team-min" className="text-sm">Min Team Size</Label>
          <Input
            id="event-team-min"
            type="number"
            min="1"
            value={event.teamSize?.min || 1}
            onChange={(e) => onChange("teamSize.min", e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="event-team-max" className="text-sm">Max Team Size</Label>
          <Input
            id="event-team-max"
            type="number"
            min="1"
            value={event.teamSize?.max || 1}
            onChange={(e) => onChange("teamSize.max", e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm">Event Image</Label>
        <div className="w-full overflow-hidden">
          <ImageUpload
            value={event.image}
            onChange={(url) => onChange("image", url)}
            onRemove={resetImage}
            previewWidth={300}
            aspectRatio="16:9"
            description="Upload an event image (16:9 aspect ratio recommended)"
          />
        </div>
      </div>
      
      {/* Prizes Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Prizes</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem("prizes", { position: "", reward: "" })}
            className="h-8 px-2"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            Add Prize
          </Button>
        </div>
        
        <div className="space-y-3">
          {event.prizes?.map((prize, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
              <div className="space-y-2 flex-1">
                <Label htmlFor={`prize-position-${index}`} className="text-xs">Position</Label>
                <Input
                  id={`prize-position-${index}`}
                  value={prize.position}
                  onChange={(e) => handleArrayFieldChange("prizes", index, e.target.value, "position")}
                  placeholder="e.g., 1st, 2nd, 3rd"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2 flex-1">
                <Label htmlFor={`prize-reward-${index}`} className="text-xs">Reward</Label>
                <Input
                  id={`prize-reward-${index}`}
                  value={prize.reward}
                  onChange={(e) => handleArrayFieldChange("prizes", index, e.target.value, "reward")}
                  placeholder="e.g., ₹5000, Certificate"
                  className="w-full"
                />
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem("prizes", index)}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 w-8 mt-5 sm:mt-0"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove prize</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Coordinators Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Coordinators</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem("coordinators", { name: "", email: "", phone: "" })}
            className="h-8 px-2"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            Add Coordinator
          </Button>
        </div>
        
        <div className="space-y-4">
          {event.coordinators?.map((coordinator, index) => (
            <div key={index} className="space-y-3 p-3 border rounded-md bg-muted/20">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-medium">Coordinator #{index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem("coordinators", index)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-7 w-7"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Remove coordinator</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor={`coordinator-name-${index}`} className="text-xs">Name</Label>
                  <Input
                    id={`coordinator-name-${index}`}
                    value={coordinator.name}
                    onChange={(e) => handleArrayFieldChange("coordinators", index, e.target.value, "name")}
                    placeholder="Full name"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`coordinator-email-${index}`} className="text-xs">Email</Label>
                  <Input
                    id={`coordinator-email-${index}`}
                    value={coordinator.email}
                    onChange={(e) => handleArrayFieldChange("coordinators", index, e.target.value, "email")}
                    placeholder="Email address"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`coordinator-phone-${index}`} className="text-xs">Phone</Label>
                  <Input
                    id={`coordinator-phone-${index}`}
                    value={coordinator.phone}
                    onChange={(e) => handleArrayFieldChange("coordinators", index, e.target.value, "phone")}
                    placeholder="Contact number"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Rules Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Rules</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem("rules", "")}
            className="h-8 px-2"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            Add Rule
          </Button>
        </div>
        
        <div className="space-y-2">
          {event.rules?.map((rule, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <Input
                  value={rule}
                  onChange={(e) => handleArrayFieldChange("rules", index, e.target.value)}
                  placeholder={`Rule #${index + 1}`}
                  className="w-full"
                />
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem("rules", index)}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove rule</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Competition Structure Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Competition Structure</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem("competitionStructure", "")}
            className="h-8 px-2"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            Add Round
          </Button>
        </div>
        
        <div className="space-y-2">
          {event.competitionStructure?.map((round, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <Input
                  value={round}
                  onChange={(e) => handleArrayFieldChange("competitionStructure", index, e.target.value)}
                  placeholder={`Round ${index + 1}`}
                  className="w-full"
                />
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem("competitionStructure", index)}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove round</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Evaluation Criteria Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Evaluation Criteria</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem("evaluationCriteria", "")}
            className="h-8 px-2"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            Add Criteria
          </Button>
        </div>
        
        <div className="space-y-2">
          {event.evaluationCriteria?.map((criteria, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <Input
                  value={criteria}
                  onChange={(e) => handleArrayFieldChange("evaluationCriteria", index, e.target.value)}
                  placeholder={`Criteria #${index + 1}`}
                  className="w-full"
                />
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem("evaluationCriteria", index)}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove criteria</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Additional Information */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event-instructions" className="text-sm">Instructions</Label>
          <Textarea
            id="event-instructions"
            value={event.instructions || ""}
            onChange={(e) => onChange("instructions", e.target.value)}
            placeholder="Additional instructions for participants"
            rows={3}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="event-resources" className="text-sm">Resources</Label>
          <Textarea
            id="event-resources"
            value={event.resources || ""}
            onChange={(e) => onChange("resources", e.target.value)}
            placeholder="Links to resources, materials, or references"
            rows={3}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="event-whatsapp" className="text-sm">WhatsApp Group Link</Label>
          <Input
            id="event-whatsapp"
            value={event.whatsappGroup || ""}
            onChange={(e) => onChange("whatsappGroup", e.target.value)}
            placeholder="https://chat.whatsapp.com/..."
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
} 