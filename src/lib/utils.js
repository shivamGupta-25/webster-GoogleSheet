import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Cache for site content
let siteContentCache = null;
let techelonsDataCache = null;
let techelonsDataCacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to fetch site content
export async function fetchSiteContent() {
  if (siteContentCache) {
    return siteContentCache;
  }
  
  try {
    const response = await fetch('/api/content');
    
    if (!response.ok) {
      throw new Error('Failed to fetch site content');
    }
    
    const data = await response.json();
    siteContentCache = data;
    return data;
  } catch (error) {
    console.error('Error fetching site content:', error);
    return null;
  }
}

// Function to fetch Techelons data with improved error handling and caching
export async function fetchTechelonsData() {
  // Check if cache is valid
  const now = Date.now();
  const isCacheValid = techelonsDataCache && techelonsDataCacheTimestamp && (now - techelonsDataCacheTimestamp < CACHE_DURATION);
  
  if (isCacheValid) {
    return techelonsDataCache;
  }
  
  try {
    // Create a promise that rejects after a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 5000);
    });
    
    // Create the fetch promise
    const fetchPromise = fetch('/api/techelons');
    
    // Race the fetch against the timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Techelons data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Update cache
    techelonsDataCache = data;
    techelonsDataCacheTimestamp = now;
    
    return data;
  } catch (error) {
    console.error('Error fetching Techelons data:', error);
    
    // If we have cached data, return it even if it's expired
    if (techelonsDataCache) {
      console.warn('Returning expired cached Techelons data due to fetch error');
      return techelonsDataCache;
    }
    
    return null;
  }
}
