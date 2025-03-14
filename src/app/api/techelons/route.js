import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Helper function to check if a value is an object
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Deep merge function to properly handle nested objects and arrays
function deepMerge(target, source) {
  if (!source) return target;
  
  const output = { ...target };
  
  for (const key in source) {
    if (isObject(target[key]) && isObject(source[key])) {
      output[key] = deepMerge(target[key], source[key]);
    } else if (Array.isArray(source[key])) {
      // For arrays, we want to replace the entire array rather than merge
      output[key] = [...source[key]];
    } else {
      output[key] = source[key];
    }
  }
  
  return output;
}

// This endpoint allows updating the Techelons data
export async function POST(request) {
  try {
    // In a production environment, you would add authentication here
    // For now, we'll allow all requests for demonstration purposes
    
    // Get the content from the request body
    const techelonsData = await request.json();
    
    if (!techelonsData) {
      return NextResponse.json(
        { error: 'No Techelons data provided' },
        { status: 400 }
      );
    }

    // Get the current Techelons data to preserve any sections not included in the update
    const { 
      festInfo, 
      eventCategories, 
      registrationStatus, 
      festDays, 
      events, 
      whatsappGroups, 
      EVENT_IMAGES 
    } = await import('@/app/_data/techelonsData');
    
    // Create a current content object
    const currentContent = {
      festInfo,
      eventCategories,
      registrationStatus,
      festDays,
      events,
      whatsappGroups,
      EVENT_IMAGES
    };
    
    // Extract UI content if it exists
    let uiContent = techelonsData.uiContent || null;
    
    // Remove UI content from the data to be saved to techelonsData.js
    if (techelonsData.uiContent) {
      delete techelonsData.uiContent;
    }
    
    // Use deep merge to properly handle nested objects and arrays
    const mergedContent = deepMerge(currentContent, techelonsData);

    // Format the content as a JavaScript module
    const contentString = `/**
 * Tech Fest Constants and Data
 * This file contains all the constants and data related to the tech fest events.
 */

// Fest Information
const festInfo = ${JSON.stringify(mergedContent.festInfo, null, 2)};

// Event Categories
const eventCategories = ${JSON.stringify(mergedContent.eventCategories, null, 2)};

// Registration Status
const registrationStatus = ${JSON.stringify(mergedContent.registrationStatus, null, 2)};

// Fest Days
const festDays = ${JSON.stringify(mergedContent.festDays, null, 2)};

// Constants for event images
const EVENT_IMAGES = ${JSON.stringify(mergedContent.EVENT_IMAGES, null, 2)};

// Helper function to get image path
const getImagePath = (imagePath) => {
  if (!imagePath) return EVENT_IMAGES.DEFAULT_EVENT_IMAGE;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  if (imagePath.startsWith("/public/")) return imagePath.replace("/public", "");
  return imagePath;
};

// WhatsApp Groups
const whatsappGroups = ${JSON.stringify(mergedContent.whatsappGroups || {}, null, 2)};

// Helper function to get events by day
const getEventsByDay = (day) => {
  return events.filter(event => event.festDay === day);
};

// Helper function to get events by category
const getEventsByCategory = (category) => {
  return events.filter(event => event.category === category);
};

// Helper function to get event by ID
const getEventById = (id) => {
  return events.find(event => event.id === id);
};

// Helper function to get WhatsApp group link
const getWhatsAppGroupLink = (eventId) => {
  return whatsappGroups[eventId] || null;
};

// Helper function to format event date and time
const formatEventDateTime = (dateOrEvent, timeParam) => {
  // Handle case when an event object is passed
  let date, time;
  
  if (typeof dateOrEvent === 'object' && dateOrEvent !== null) {
    // An event object was passed
    const event = dateOrEvent;
    date = event.date;
    time = event.time;
  } else {
    // Individual date and time parameters were passed
    date = dateOrEvent;
    time = timeParam;
  }
  
  if (!date) return { formattedDate: "TBA", formattedTime: "TBA", dayOfWeek: "" };
  
  try {
    const eventDate = new Date(date);
    
    // Check if the date is valid
    if (isNaN(eventDate.getTime())) {
      return { formattedDate: "TBA", formattedTime: "TBA", dayOfWeek: "" };
    }
    
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    return {
      formattedDate,
      formattedTime: time || "TBA",
      dayOfWeek
    };
  } catch (error) {
    console.error("Error formatting date:", error);
    return { formattedDate: "TBA", formattedTime: "TBA", dayOfWeek: "" };
  }
};

// Events Data
const events = ${JSON.stringify(mergedContent.events, null, 2)};

// UI Content for TechelonsMain component
const uiContent = ${JSON.stringify(uiContent || {
  title: "Techelons'25",
  subtitle: "Shivaji College's premier technical festival, where innovation meets creativity.",
  festDate: "April 2025",
  aboutTitle: "About Techelons",
  aboutParagraphs: [
    "Techelons is the annual tech fest by Websters, the CS Society of Shivaji College, DU. It's where students showcase technical skills through competitions, hackathons, and coding challenges.",
    "Beyond competitions, Techelons features expert-led seminars on emerging tech and industry trends. The fest promotes networking and collaboration among students and professionals in a celebration of technological innovation."
  ],
  exploreTitle: "Explore the Future of Technology",
  exploreDescription: "Join us for two days of innovation, competition, and creativity at Shivaji College. Showcase your skills and connect with tech enthusiasts from across the nation.",
  features: [
    {
      title: "Competitions",
      icon: "🏆",
      description: "Participate in coding, analysis, and gaming competitions with exciting prizes."
    },
    {
      title: "Seminar",
      icon: "🎤",
      description: "Gain insights from industry leaders through engaging and informative seminars."
    },
    {
      title: "Networking",
      icon: "🌐",
      description: "Connect with tech enthusiasts and industry professionals."
    }
  ]
}, null, 2)};

// Export all constants and data
export {
  festInfo,
  eventCategories,
  registrationStatus,
  festDays,
  events,
  whatsappGroups,
  getEventsByDay,
  getEventsByCategory,
  getEventById,
  getWhatsAppGroupLink,
  formatEventDateTime,
  getImagePath,
  EVENT_IMAGES,
  uiContent
};`;

    // Write the content to the file
    const filePath = path.join(process.cwd(), 'src', 'app', '_data', 'techelonsData.js');
    await fs.writeFile(filePath, contentString, 'utf8');

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating Techelons data:', error);
    return NextResponse.json(
      { error: 'Failed to update Techelons data' },
      { status: 500 }
    );
  }
}

// This endpoint allows fetching the current Techelons data
export async function GET() {
  try {
    // Import the content dynamically
    const { 
      festInfo, 
      eventCategories, 
      registrationStatus, 
      festDays, 
      events, 
      whatsappGroups, 
      EVENT_IMAGES,
      uiContent
    } = await import('@/app/_data/techelonsData');
    
    // Create a response object with the data
    const responseData = {
      festInfo,
      eventCategories,
      registrationStatus,
      festDays,
      events,
      whatsappGroups,
      EVENT_IMAGES,
      uiContent
    };
    
    // Return the content
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching Techelons data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Techelons data' },
      { status: 500 }
    );
  }
} 