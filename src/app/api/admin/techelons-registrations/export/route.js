import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TechelonsRegistration from '@/models/TechelonsRegistration';

// Helper function to convert registrations to CSV format
function convertToCSV(registrations) {
  // Define CSV headers
  const headers = [
    'Event ID',
    'Event Name',
    'Team Name',
    'Registration Date',
    'Main Participant Name',
    'Main Participant Email',
    'Main Participant Phone',
    'Main Participant Roll No',
    'Main Participant Course',
    'Main Participant Year',
    'Main Participant College',
    'Team Members',
    'Query'
  ];
  
  // Create CSV rows
  const rows = registrations.map(reg => {
    // Format team members as a single string
    const teamMembers = reg.teamMembers && reg.teamMembers.length > 0
      ? reg.teamMembers.map(member => 
          `${member.name} (${member.email}, ${member.phone}, ${member.rollNo}, ${member.course}, ${member.year}, ${member.college})`
        ).join(' | ')
      : '';
    
    // Format date
    const date = new Date(reg.registrationDate).toLocaleString();
    
    return [
      reg.eventId,
      reg.eventName,
      reg.teamName || 'N/A',
      date,
      reg.mainParticipant.name,
      reg.mainParticipant.email,
      reg.mainParticipant.phone,
      reg.mainParticipant.rollNo,
      reg.mainParticipant.course,
      reg.mainParticipant.year,
      reg.mainParticipant.college,
      teamMembers,
      reg.query || 'N/A'
    ];
  });
  
  // Combine headers and rows
  return [headers, ...rows]
    .map(row => 
      row.map(value => 
        // Escape quotes and wrap fields with commas in quotes
        typeof value === 'string' && (value.includes(',') || value.includes('"')) 
          ? `"${value.replace(/"/g, '""')}"` 
          : value
      ).join(',')
    )
    .join('\n');
}

export async function GET() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get all registrations
    const registrations = await TechelonsRegistration.find({})
      .sort({ registrationDate: -1 });
    
    // Convert to CSV
    const csv = convertToCSV(registrations);
    
    // Set headers for file download
    const headers = new Headers();
    headers.append('Content-Type', 'text/csv');
    headers.append('Content-Disposition', 'attachment; filename=techelons-registrations.csv');
    
    return new NextResponse(csv, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error exporting registrations:', error);
    return NextResponse.json({ error: 'Failed to export registrations' }, { status: 500 });
  }
} 