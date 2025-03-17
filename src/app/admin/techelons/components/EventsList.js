import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Filter, Search, Trash2 } from "lucide-react";
import EventForm from "./EventForm";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function EventsList({ 
  techelonsData, 
  handleEventChange, 
  removeEvent, 
  resetImageToPlaceholder 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedEvents, setExpandedEvents] = useState({});

  // Toggle event expansion
  const toggleEventExpansion = (eventId) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  // Filter events based on search term and category
  const filteredEvents = techelonsData.events.filter(event => {
    const matchesSearch = 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="w-full">
      <CardHeader className="px-3 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Manage Events</CardTitle>
        <CardDescription className="text-sm">
          Edit or remove existing Techelons events
        </CardDescription>
        
        {/* Search and Filter Controls */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-[180px]">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span className="truncate">{categoryFilter !== "all" ? 
                      Object.keys(techelonsData.eventCategories).find(
                        key => techelonsData.eventCategories[key] === categoryFilter
                      )?.replace('_', ' ') || categoryFilter 
                      : "All Categories"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(techelonsData.eventCategories).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Event count and filters display */}
          <div className="flex flex-wrap items-center justify-between text-sm gap-2">
            <span className="text-muted-foreground">
              {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} found
            </span>
            
            {(searchTerm || categoryFilter !== "all") && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}
                className="ml-auto"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-3 sm:px-6">
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => {
              const originalIndex = techelonsData.events.findIndex(e => e.id === event.id);
              const isExpanded = expandedEvents[event.id] ?? false;
              
              return (
                <Card key={event.id} className="overflow-hidden border">
                  <div 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-muted/50 gap-2"
                    onClick={() => toggleEventExpansion(event.id)}
                  >
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium">{event.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {Object.keys(techelonsData.eventCategories).find(
                            key => techelonsData.eventCategories[key] === event.category
                          )?.replace('_', ' ') || event.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 max-w-full">
                        {event.shortDescription || "No description provided"}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEvent(originalIndex);
                        }}
                        className="h-8 px-2 sm:px-3"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:ml-1.5">Remove</span>
                      </Button>
                      
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-3 sm:p-4 pt-0 border-t overflow-x-auto">
                      <EventForm 
                        event={event}
                        onChange={(field, value) => handleEventChange(originalIndex, field, value)}
                        techelonsData={techelonsData}
                        resetImage={() => resetImageToPlaceholder(originalIndex)}
                      />
                    </div>
                  )}
                </Card>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {techelonsData.events.length === 0 ? (
                "No events added yet. Use the \"Add Event\" tab to create new events."
              ) : (
                "No events match your search criteria."
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 