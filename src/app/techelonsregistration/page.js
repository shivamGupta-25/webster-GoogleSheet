"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchTechelonsData } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import RegistrationForm from "./components/RegistrationForm";
import EventSelection from "./components/EventSelection";

export default function TechelonsRegistrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [techelonsData, setTechelonsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Fetch Techelons data
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await fetchTechelonsData();
        if (data) {
          setTechelonsData(data);
        } else {
          setServerError('Failed to load Techelons data. Please try again later.');
        }
      } catch (error) {
        console.error('Error loading Techelons data:', error);
        setServerError('Failed to load Techelons data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
  }, []);

  // Handle eventId from URL query parameter
  useEffect(() => {
    if (!isLoading && techelonsData?.events && !selectedEvent) {
      // Get eventId from URL query parameter
      const params = new URLSearchParams(window.location.search);
      const eventId = params.get('eventId');
      
      if (eventId) {
        // Find the event with the matching ID
        const event = techelonsData.events.find(e => e.id === eventId);
        if (event) {
          setSelectedEvent(event);
        }
      }
    }
  }, [isLoading, techelonsData, selectedEvent]);

  // Redirect if registration is closed
  useEffect(() => {
    if (!isLoading && techelonsData && !techelonsData.festInfo?.registrationEnabled) {
      router.push('/registrationclosed');
    }
  }, [router, techelonsData, isLoading]);

  // Handle online status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle event selection
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setServerError(null);
  };

  // Handle back button click
  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setServerError(null);
    
    // Clear the URL parameter
    const url = new URL(window.location.href);
    url.searchParams.delete('eventId');
    window.history.replaceState({}, '', url);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-10 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-3xl mx-auto">
        {!isOnline && (
          <Alert variant="destructive" className="mb-4 sm:mb-6">
            <AlertDescription className="text-sm sm:text-base">
              You appear to be offline. Please check your internet connection and try again.
            </AlertDescription>
          </Alert>
        )}
        
        {serverError && (
          <Alert variant="destructive" className="mb-4 sm:mb-6">
            <AlertDescription className="text-sm sm:text-base">{serverError}</AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 md:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
            Techelons Registration
          </h1>
          
          {isLoading ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <Skeleton className="h-7 w-48 mx-auto rounded-md" />
                <Skeleton className="h-5 w-64 mx-auto mt-2 rounded-md" />
              </div>
              
              {/* Tabs skeleton */}
              <div className="w-full">
                <Skeleton className="h-10 w-full rounded-md mb-4" />
                
                {/* Event cards grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <Skeleton className="h-6 w-32 rounded-md" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-full rounded-md" />
                      
                      <div className="space-y-2 py-2">
                        <Skeleton className="h-4 w-3/4 rounded-md" />
                        <Skeleton className="h-4 w-2/3 rounded-md" />
                        <Skeleton className="h-4 w-4/5 rounded-md" />
                      </div>
                      
                      <Skeleton className="h-8 w-full rounded-md mt-2" />
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center mt-3">
                Loading Techelons data...
              </p>
            </div>
          ) : techelonsData ? (
            selectedEvent ? (
              <RegistrationForm 
                event={selectedEvent}
                onBack={handleBackToEvents}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                setServerError={setServerError}
              />
            ) : (
              <EventSelection 
                events={techelonsData.events || []}
                onSelectEvent={handleEventSelect}
                categories={techelonsData.eventCategories || {}}
              />
            )
          ) : (
            <div className="text-center py-6 sm:py-8">
              <p className="text-red-500 dark:text-red-400 text-sm sm:text-base">
                Failed to load Techelons data. Please try again later.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
