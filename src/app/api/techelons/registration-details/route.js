import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TechelonsRegistration from '@/models/TechelonsRegistration';
import TechelonsData from '@/models/TechelonsData';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const eventId = searchParams.get('eventId');
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Find registration by email and eventId if provided
    const query = { 'mainParticipant.email': email };
    if (eventId) {
      query.eventId = eventId;
    }
    
    const registration = await TechelonsRegistration.findOne(query);
    
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    
    // Find event details
    const techelonsData = await TechelonsData.findOne({});
    const event = techelonsData?.events.find(e => e.id === registration.eventId);
    
    return NextResponse.json({
      registration,
      event
    });
  } catch (error) {
    console.error('Error fetching registration details:', error);
    return NextResponse.json({ error: 'Failed to fetch registration details' }, { status: 500 });
  }
} 