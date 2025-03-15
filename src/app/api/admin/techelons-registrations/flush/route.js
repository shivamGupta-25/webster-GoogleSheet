import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TechelonsRegistration from '@/models/TechelonsRegistration';

export async function DELETE() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Delete all registrations
    const result = await TechelonsRegistration.deleteMany({});
    
    return NextResponse.json({ 
      message: 'All registrations deleted successfully',
      count: result.deletedCount
    });
  } catch (error) {
    console.error('Error flushing registrations:', error);
    return NextResponse.json({ error: 'Failed to flush registrations' }, { status: 500 });
  }
} 