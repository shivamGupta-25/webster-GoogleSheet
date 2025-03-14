import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import siteContent from '@/app/_data/siteContent';

// This is a simple API route to update the workshop data
export async function POST(request) {
  try {
    // In a production environment, you would add authentication here
    // For now, we'll allow all requests for demonstration purposes
    
    const workshopData = await request.json();
    
    if (!workshopData) {
      return NextResponse.json(
        { error: 'No workshop data provided' },
        { status: 400 }
      );
    }

    // Update the workshop data in siteContent
    const updatedContent = {
      ...siteContent,
      workshop: {
        ...siteContent.workshop,
        ...workshopData
      }
    };

    // Format the content as a JavaScript module
    const contentString = `// Centralized site content data for easy management
const siteContent = ${JSON.stringify(updatedContent, null, 2)};

export default siteContent;`;

    // Write the content to the file
    const filePath = path.join(process.cwd(), 'src', 'app', '_data', 'siteContent.js');
    await fs.writeFile(filePath, contentString, 'utf8');

    return NextResponse.json(updatedContent.workshop);
  } catch (error) {
    console.error('Error updating workshop:', error);
    return NextResponse.json({ error: 'Failed to update workshop' }, { status: 500 });
  }
}

// This endpoint allows fetching the current workshop data
export async function GET() {
  try {
    // Return just the workshop section
    return NextResponse.json(siteContent.workshop || {});
  } catch (error) {
    console.error('Error fetching workshop data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workshop data' },
      { status: 500 }
    );
  }
} 