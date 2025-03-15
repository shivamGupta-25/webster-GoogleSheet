"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchTechelonsData } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RegistrationForm from "./components/RegistrationForm";
import EventSelection from "./components/EventSelection";
import LoadingSpinner from "./components/LoadingSpinner";

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
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {!isOnline && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              You appear to be offline. Please check your internet connection and try again.
            </AlertDescription>
          </Alert>
        )}
        
        {serverError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
            Techelons Registration
          </h1>
          
          {isLoading ? (
            <LoadingSpinner message="Loading Techelons data..." />
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
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400">
                Failed to load Techelons data. Please try again later.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
