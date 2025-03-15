import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react";

export default function EventSelection({ events, onSelectEvent, categories }) {
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Group events by category
  const eventsByCategory = events.reduce((acc, event) => {
    const category = event.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(event);
    return acc;
  }, { "all": events });
  
  // Get unique categories
  const uniqueCategories = Object.keys(eventsByCategory).filter(cat => cat !== "all");
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Select an Event</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Choose the event you want to register for
        </p>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="all">All Events</TabsTrigger>
          {uniqueCategories.map(category => (
            <TabsTrigger key={category} value={category}>
              {categories[category] || category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onSelect={onSelectEvent}
                categories={categories}
              />
            ))}
          </div>
        </TabsContent>
        
        {uniqueCategories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventsByCategory[category].map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onSelect={onSelectEvent}
                  categories={categories}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function EventCard({ event, onSelect, categories }) {
  const isRegistrationOpen = event.registrationStatus === "open";
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{event.name}</CardTitle>
          {event.category && (
            <Badge variant="outline" className="ml-2">
              {categories[event.category] || event.category}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {event.shortDescription || event.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          {event.date && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>{event.date}</span>
            </div>
          )}
          
          {event.time && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-2" />
              <span>{event.time}</span>
            </div>
          )}
          
          {event.venue && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.venue}</span>
            </div>
          )}
          
          {event.teamSize && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4 mr-2" />
              <span>
                {event.teamSize.min === event.teamSize.max 
                  ? `${event.teamSize.min} members`
                  : `${event.teamSize.min}-${event.teamSize.max} members`}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onSelect(event)} 
          className="w-full"
          disabled={!isRegistrationOpen}
          variant={isRegistrationOpen ? "default" : "outline"}
        >
          {isRegistrationOpen ? "Register Now" : "Registration Closed"}
        </Button>
      </CardFooter>
    </Card>
  );
} 