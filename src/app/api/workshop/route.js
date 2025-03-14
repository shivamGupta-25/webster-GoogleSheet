// NOTE: This file was automatically updated to use fetchSiteContent instead of importing siteContent directly.
// Please review and update the component to use the async fetchSiteContent function.
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';
import { fetchSiteContent } from '@/lib/utils';

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

    // Connect to the database
    await connectToDatabase();
    
    // Find the site content document
    let siteContent = await SiteContent.findOne({});
    
    if (!siteContent) {
      return NextResponse.json(
        { error: 'Site content not found' },
        { status: 404 }
      );
    }
    
    // Update the workshop data in the database
    siteContent = await SiteContent.findByIdAndUpdate(
      siteContent._id,
      { workshop: workshopData },
      { new: true, runValidators: true }
    );

    return NextResponse.json(siteContent.workshop);
  } catch (error) {
    console.error('Error updating workshop:', error);
    return NextResponse.json({ error: 'Failed to update workshop' }, { status: 500 });
  }
}

// This endpoint allows fetching the current workshop data
export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Find the site content document
    const siteContent = await SiteContent.findOne({});
    
    if (!siteContent) {
      return NextResponse.json(
        { error: 'Site content not found' },
        { status: 404 }
      );
    }
    
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