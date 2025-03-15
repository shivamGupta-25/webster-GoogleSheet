import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TechelonsRegistration from '@/models/TechelonsRegistration';

// GET handler to fetch all registrations
export async function GET(request) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get all registrations, sorted by registration date (newest first)
    const registrations = await TechelonsRegistration.find({})
      .sort({ registrationDate: -1 });
    
    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

// DELETE handler to delete a specific registration
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 });
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Delete the registration
    const result = await TechelonsRegistration.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 });
  }
} 