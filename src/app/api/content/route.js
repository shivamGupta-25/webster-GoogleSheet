import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// This is a simple API route to update the site content
export async function POST(request) {
  try {
    // In a production environment, you would add authentication here
    // For now, we'll allow all requests for demonstration purposes
    
    // Get the content from the request body
    const content = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }

    // Get the current content to preserve any sections not included in the update
    const { default: currentContent } = await import('@/app/_data/siteContent');
    
    // Use deep merge to properly handle nested objects and arrays
    const mergedContent = deepMerge(currentContent, content);

    // Ensure workshop data is properly formatted
    if (mergedContent.workshop) {
      // Make sure isRegistrationOpen is a boolean
      mergedContent.workshop.isRegistrationOpen = Boolean(mergedContent.workshop.isRegistrationOpen);
    }

    // Format the content as a JavaScript module
    const contentString = `// Centralized site content data for easy management
const siteContent = ${JSON.stringify(mergedContent, null, 2)};

export default siteContent;`;

    // Write the content to the file
    const filePath = path.join(process.cwd(), 'src', 'app', '_data', 'siteContent.js');
    await fs.writeFile(filePath, contentString, 'utf8');

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

// This endpoint allows fetching the current content
export async function GET() {
  try {
    // Import the content dynamically
    const { default: siteContent } = await import('@/app/_data/siteContent');
    
    // Return the content
    return NextResponse.json(siteContent);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
} 