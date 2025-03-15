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
    // Determine if we're in a browser or server environment
    const isServer = typeof window === 'undefined';
    
    if (isServer) {
      // In server environment, use absolute URL with the host from environment variable
      // or connect directly to the database
      try {
        const { default: connectToDatabase } = await import('@/lib/mongodb');
        const { default: SiteContent } = await import('@/models/SiteContent');
        
        await connectToDatabase();
        const content = await SiteContent.findOne({});
        
        if (!content) {
          console.warn('No site content found in database');
          return null;
        }
        
        siteContentCache = content;
        return content;
      } catch (dbError) {
        console.error('Error connecting to database during build:', dbError);
        // During build time, return null instead of throwing an error
        return null;
      }
    } else {
      // In browser environment, use relative URL
      const response = await fetch('/api/content');
      
      if (!response.ok) {
        throw new Error('Failed to fetch site content');
      }
      
      const data = await response.json();
      siteContentCache = data;
      return data;
    }
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
    // Determine if we're in a browser or server environment
    const isServer = typeof window === 'undefined';
    
    if (isServer) {
      // In server environment, connect directly to the database
      const { default: connectToDatabase } = await import('@/lib/mongodb');
      const { default: TechelonsData } = await import('@/models/TechelonsData');
      
      await connectToDatabase();
      const data = await TechelonsData.findOne({});
      
      if (!data) {
        console.warn('No Techelons data found in database');
        return null;
      }
      
      techelonsDataCache = data;
      techelonsDataCacheTimestamp = now;
      return data;
    } else {
      // In browser environment, use relative URL with timeout
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
    }
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
