import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import EventForm from "./EventForm";
import toast from "react-hot-toast";

export default function AddEvent({ 
  newEvent, 
  handleNewEventChange, 
  addEvent, 
  resetNewEventImage, 
  techelonsData 
}) {
  // Validate required fields before adding event
  const validateEvent = () => {
    if (!newEvent.id || !newEvent.name || !newEvent.category || !newEvent.festDay) {
      toast.error("Please fill in all required fields (ID, Name, Category, and Fest Day)");
      return false;
    }

    // Check if ID already exists
    if (techelonsData.events.some(event => event.id === newEvent.id)) {
      toast.error("An event with this ID already exists");
      return false;
    }

    return true;
  };

  // Handle add event with validation
  const handleAddEvent = () => {
    if (validateEvent()) {
      addEvent();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Add New Event</CardTitle>
        <CardDescription className="text-sm">
          Create a new event for Techelons
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <EventForm 
          event={newEvent}
          onChange={handleNewEventChange}
          techelonsData={techelonsData}
          resetImage={resetNewEventImage}
          isNewEvent={true}
        />
        
        <div className="mt-6">
          <Button onClick={handleAddEvent} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 