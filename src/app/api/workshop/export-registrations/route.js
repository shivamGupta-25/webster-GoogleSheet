import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WorkshopRegistration from '@/models/WorkshopRegistration';
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    // Check if user is authenticated by checking for admin cookie
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
    
    // Define CSV headers based on the registration schema
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Roll No',
      'Course',
      'College',
      'Year',
      'Query',
      'Registration Date'
    ];
    
    // Convert registrations to CSV format
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Fetch all workshop registrations
    const registrations = await WorkshopRegistration.find({})
      .sort({ registrationDate: -1 }) // Sort by registration date (newest first)
      .lean(); // Convert to plain JavaScript objects
    
    // Add data rows if registrations exist
    if (registrations && registrations.length > 0) {
      for (const registration of registrations) {
        const row = [
          // Wrap values in quotes and escape any quotes inside values
          `"${(registration.name || '').replace(/"/g, '""')}"`,
          `"${(registration.email || '').replace(/"/g, '""')}"`,
          `"${(registration.phone || '').replace(/"/g, '""')}"`,
          `"${(registration.rollNo || '').replace(/"/g, '""')}"`,
          `"${(registration.course || '').replace(/"/g, '""')}"`,
          `"${(registration.college || '').replace(/"/g, '""')}"`,
          `"${(registration.year || '').replace(/"/g, '""')}"`,
          `"${(registration.query || '').replace(/"/g, '""')}"`,
          `"${registration.registrationDate ? new Date(registration.registrationDate).toLocaleString() : ''}"`,
        ];
        
        csvRows.push(row.join(','));
      }
    }
    
    // Join rows with newlines to create the CSV content
    const csvContent = csvRows.join('\n');
    
    // Create a response with the CSV content
    const response = new NextResponse(csvContent);
    
    // Set appropriate headers for a CSV file download
    response.headers.set('Content-Type', 'text/csv');
    response.headers.set('Content-Disposition', `attachment; filename="workshop-registrations-${new Date().toISOString().split('T')[0]}.csv"`);
    
    return response;
  } catch (error) {
    console.error('Error exporting workshop registration data:', error);
    
    return NextResponse.json({
      error: 'Failed to export workshop registration data',
      message: error.message
    }, { status: 500 });
  }
} 