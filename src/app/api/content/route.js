import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';

// GET handler to fetch site content
export async function GET() {
  try {
    await connectToDatabase();
    
    // Find the first document (we only have one document for site content)
    let content = await SiteContent.findOne({});
    
    // If no content exists yet, return a 404
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// POST handler to update site content
export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    // Find the first document or create a new one if it doesn't exist
    let content = await SiteContent.findOne({});
    
    if (content) {
      // Update existing document
      content = await SiteContent.findByIdAndUpdate(
        content._id,
        body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new document
      content = await SiteContent.create(body);
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
} 