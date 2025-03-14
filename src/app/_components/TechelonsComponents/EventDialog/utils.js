// NOTE: This file was automatically updated to use fetchTechelonsData instead of importing from techelonsData directly.
// Please review and update the component to use the async fetchTechelonsData function.
import { fetchTechelonsData } from '@/lib/utils';

// Cache for techelons data to avoid multiple fetches
let cachedTechelonsData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get the image path for an event
 * 
 * @param {string} imagePath - The image path from the event object
 * @returns {string} - The processed image path
 */
export const getImagePath = (imagePath) => {
  const DEFAULT_EVENT_IMAGE = '/assets/default-event.jpg';
  
  if (!imagePath) return DEFAULT_EVENT_IMAGE;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  if (imagePath.startsWith("/public/")) return imagePath.replace("/public", "");
  if (imagePath === "Poster2.jpg" || imagePath === "Poster.png") return `/assets/${imagePath}`;
  if (!imagePath.startsWith("/")) return `/${imagePath}`;
  return imagePath;
};

/**
 * Get the effective registration status for an event, taking into account
 * both the master registrationEnabled flag and the individual event's status
 * 
 * @param {Object} event - The event object
 * @returns {Promise<string>} - The effective registration status
 */
export const getEffectiveRegistrationStatus = async (event) => {
  try {
    // Check if cache is valid
    const now = Date.now();
    const isCacheValid = cachedTechelonsData && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION);
    
    // Use cached data if available and valid, otherwise fetch
    if (!isCacheValid) {
      cachedTechelonsData = await fetchTechelonsData();
      cacheTimestamp = now;
    }
    
    // If we couldn't fetch the data, default to closed
    if (!cachedTechelonsData) {
      console.warn('Could not fetch Techelons data, defaulting to closed registration');
      return 'closed';
    }
    
    const { festInfo, registrationStatus } = cachedTechelonsData;
    
    // Check if registration is globally disabled
    if (!festInfo?.registrationEnabled) {
      return registrationStatus?.CLOSED || 'closed';
    }
    
    // Check if the event has a specific registration status
    if (event.registrationStatus) {
      return event.registrationStatus;
    }
    
    // If global registration is enabled and no specific event status, return open
    return registrationStatus?.OPEN || 'open';
  } catch (error) {
    console.error('Error getting registration status:', error);
    return 'closed';
  }
};

/**
 * Format event date and time into a user-friendly format
 * 
 * @param {Object} event - The event object
 * @returns {Object} - Formatted date, time, and day of week
 */
export const formatEventDateTime = (event) => {
  if (!event) {
    return {
      formattedDate: "To be announced",
      formattedTime: "To be announced",
      dayOfWeek: ""
    };
  }

  try {
    // Default values
    let formattedDate = "To be announced";
    let formattedTime = "To be announced";
    let dayOfWeek = "";

    // Format date if available
    if (event.date) {
      try {
        // Try to parse the date
        const dateObj = new Date(event.date);
        
        // Check if date is valid
        if (!isNaN(dateObj.getTime())) {
          // Format date: April 10, 2025
          formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
          
          // Get day of week: Monday, Tuesday, etc.
          dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        } else {
          // If date is not a valid Date object, use as is
          formattedDate = event.date;
        }
      } catch (error) {
        console.error('Error formatting date:', error);
        formattedDate = event.date;
      }
    }

    // Format time if available
    if (event.time) {
      formattedTime = event.time;
    }

    return {
      formattedDate,
      formattedTime,
      dayOfWeek
    };
  } catch (error) {
    console.error('Error in formatEventDateTime:', error);
    return {
      formattedDate: "To be announced",
      formattedTime: "To be announced",
      dayOfWeek: ""
    };
  }
}; 