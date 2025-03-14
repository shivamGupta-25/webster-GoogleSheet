import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WorkshopRegistration from '@/models/WorkshopRegistration';
import { cookies } from 'next/headers';

export async function DELETE(req) {
  try {
    // Check if user is authenticated by checking for admin cookie
    // This is a simplified approach - in a production environment, you should use a more secure method
    const cookieStore = cookies();
    const adminCookie = cookieStore.get('admin_session');
    
    if (!adminCookie || !adminCookie.value) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();
    
    // Delete all workshop registrations
    const result = await WorkshopRegistration.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: 'All workshop registration data has been flushed',
      deletedCount: result.deletedCount
    }, { status: 200 });
  } catch (error) {
    console.error('Error flushing workshop registration data:', error);
    
    return NextResponse.json({
      error: 'Failed to flush workshop registration data',
      message: error.message
    }, { status: 500 });
  }
} 