// NOTE: This file was automatically updated to use fetchTechelonsData instead of importing from techelonsData directly.
// Please review and update the component to use the async fetchTechelonsData function.
"use client"

import { useEffect, useCallback, useMemo, memo, lazy, Suspense, useState } from "react"
import PropTypes from 'prop-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { fetchTechelonsData } from '@/lib/utils';
import { getCategoryStyle } from "./constants"
import { useShareEvent, useImageHandling } from "./hooks"
import { getEffectiveRegistrationStatus, formatEventDateTime, getImagePath } from "./utils"

// Lazy loaded components with appropriate chunk names
const EventImage = lazy(() => import('./EventImage' /* webpackChunkName: "event-image" */));
const ActionButtons = lazy(() => import('./ActionButtons' /* webpackChunkName: "action-buttons" */));

// Import content components directly
import {
  EventDetails,
  Description,
  Rules,
  CompetitionStructure,
  EvaluationCriteria,
  Instructions,
  TeamSize,
  Prizes,
  Coordinators,
  Resources
} from './EventContent';

// Loading fallback with responsive design
const LoadingFallback = memo(() => (
  <div className="animate-pulse flex flex-col space-y-4 p-4">
    <div className="h-32 sm:h-40 md:h-48 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
    <div className="h-6 sm:h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
    <div className="h-20 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
  </div>
));

LoadingFallback.displayName = "LoadingFallback";

// Main component
const EventModal = memo(({ event, isOpen, onClose }) => {
  // State for registration status
  const [registrationStatus, setRegistrationStatus] = useState('closed');
  const [isLoading, setIsLoading] = useState(false);

  // Custom hooks
  const { handleShare, shareSuccess } = useShareEvent(event || {});
  const {
    imageError,
    imageLoading,
    imageHeight,
    handleImageLoad,
    handleImageError,
    resetImage
  } = useImageHandling();

  // Memoized values for performance
  const imagePath = useMemo(() => (event ? getImagePath(event.image) : null), [event?.image]);
  const categoryStyle = useMemo(() => (event ? getCategoryStyle(event.category) : null), [event?.category]);
  const formattedEventDateTime = useMemo(() => (event ? formatEventDateTime(event) : null), [event]);

  const { formattedDate, formattedTime, dayOfWeek } = formattedEventDateTime || {
    formattedDate: null,
    formattedTime: null,
    dayOfWeek: null,
  };

  // Reset image state when event changes
  useEffect(() => {
    if (isOpen) {
      resetImage();
    }
  }, [event?.id, isOpen, resetImage]);

  // Fetch registration status when event changes
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (!event) return;
      
      setIsLoading(true);
      try {
        const status = await getEffectiveRegistrationStatus(event);
        setRegistrationStatus(status);
      } catch (error) {
        console.error('Error fetching registration status:', error);
        setRegistrationStatus('closed');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && event) {
      fetchRegistrationStatus();
    }
  }, [event, isOpen]);

  // Handle registration button click
  const handleRegister = useCallback(async () => {
    if (!event) return;

    try {
      // Use the already fetched registration status
      if (registrationStatus !== 'open') {
        // If registration is closed, don't open the registration page
        return;
      }

      if (event.registrationLink) {
        window.open(event.registrationLink, "_blank", "noopener,noreferrer");
      } else {
        window.open(`/techelonsregistration?eventId=${event.id}`, "_blank");
      }
    } catch (error) {
      console.error('Error handling registration:', error);
    }
  }, [event, registrationStatus]);

  // If no event, don't render anything
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] p-0 overflow-hidden w-[95%] mx-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{event.name}</DialogTitle>
        </DialogHeader>
        
        {/* Main content with improved scrolling */}
        <div className="max-h-[85vh] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {/* Event image with responsive height */}
          <Suspense fallback={
            <div className="h-32 sm:h-40 md:h-48 lg:h-56 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          }>
            <EventImage 
              event={event}
              imagePath={imagePath}
              categoryStyle={categoryStyle}
              imageError={imageError}
              imageLoading={imageLoading}
              imageHeight={imageHeight}
              handleImageLoad={handleImageLoad}
              handleImageError={handleImageError}
            />
          </Suspense>

          {/* Event details with responsive padding */}
          <div className="p-3 sm:p-4 md:p-5 lg:p-6">
            <Suspense fallback={<LoadingFallback />}>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Basic info cards */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {/* Consolidated Event Details */}
                  <EventDetails 
                    event={event} 
                    formattedDate={formattedDate} 
                    formattedTime={formattedTime} 
                    dayOfWeek={dayOfWeek} 
                  />
                </div>

                {/* Content sections */}
                <Description description={event.description} />
                <Rules rules={event.rules} />
                <CompetitionStructure competitionStructure={event.competitionStructure} />
                <EvaluationCriteria evaluationCriteria={event.evaluationCriteria} />
                <Instructions instructions={event.instructions} />
                <TeamSize teamSize={event.teamSize} />
                <Prizes prizes={event.prizes} />
                <Coordinators coordinators={event.coordinators} />
                <Resources resources={event.resources} />

                {/* Action buttons */}
                <Suspense fallback={
                  <div className="h-10 sm:h-11 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                }>
                  <ActionButtons 
                    event={event} 
                    handleRegister={handleRegister} 
                    handleShare={handleShare} 
                    shareSuccess={shareSuccess}
                    registrationStatus={registrationStatus}
                    isLoading={isLoading}
                  />
                </Suspense>
              </div>
            </Suspense>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

EventModal.displayName = "EventModal";

EventModal.propTypes = {
  event: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default EventModal; 