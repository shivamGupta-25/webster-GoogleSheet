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
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Select an Event</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          Choose the event you want to register for
        </p>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveCategory} className="w-full">
        <TabsList className="flex flex-wrap w-full gap-0.5 xs:gap-1 mb-4 sm:mb-6">
          <TabsTrigger
            value="all"
            className="text-[10px] xxs:text-xs sm:text-sm flex-1 max-w-[calc(50%-2px)] xxs:max-w-[calc(33.333%-2px)] xs:max-w-none min-w-0 px-1.5 xxs:px-2 xs:px-3 py-1"
          >
            All Events
          </TabsTrigger>
          {uniqueCategories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="text-[10px] xxs:text-xs sm:text-sm flex-1 max-w-[calc(50%-2px)] xxs:max-w-[calc(33.333%-2px)] xs:max-w-none min-w-0 px-1.5 xxs:px-2 xs:px-3 py-1 truncate"
            >
              {categories[category] || category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
    <Card className="overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
      <CardHeader className="pb-1 sm:pb-2">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <CardTitle className="text-base sm:text-lg">{event.name}</CardTitle>
          {event.category && (
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {categories[event.category] || event.category}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 text-xs sm:text-sm mt-1">
          {event.shortDescription || event.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-1 sm:pb-2 flex-grow">
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
          {event.date && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">{event.date}</span>
            </div>
          )}

          {event.time && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>
          )}

          {event.venue && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}

          {event.teamSize && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">
                {event.teamSize.min === event.teamSize.max
                  ? `${event.teamSize.min} members`
                  : `${event.teamSize.min}-${event.teamSize.max} members`}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onClick={() => onSelect(event)}
          className="w-full text-xs sm:text-sm py-1 sm:py-2"
          disabled={!isRegistrationOpen}
          variant={isRegistrationOpen ? "default" : "outline"}
          size="sm"
        >
          {isRegistrationOpen ? "Register Now" : "Registration Closed"}
        </Button>
      </CardFooter>
    </Card>
  );
} 