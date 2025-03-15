import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TechelonsRegistration from '@/models/TechelonsRegistration';
import TechelonsData from '@/models/TechelonsData';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { sendTechelonsRegistrationEmail } from '@/app/_utils/emailServiceTechelons';

// Email validation schema
const emailSchema = z.string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .regex(
    /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|du\.ac\.in|ipu\.ac\.in|ignou\.ac\.in|jnu\.ac\.in|iitd\.ac\.in|nsut\.ac\.in|dtu\.ac\.in|igdtuw\.ac\.in|aud\.ac\.in|jamiahamdard\.edu|bhu\.ac\.in|bvpindia\.com|mait\.ac\.in|ip\.edu|msit\.in|gbpuat\.ac\.in)$/,
    "Please use valid EMail ID"
  );

// Phone validation schema
const phoneSchema = z.string()
  .min(1, "Phone number is required")
  .length(10, "Phone number must be exactly 10 digits")
  .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number");

// Team member validation schema
const teamMemberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: emailSchema,
  phone: phoneSchema,
  rollNo: z.string().min(2, "Roll No. is required"),
  course: z.string().min(2, "Course is required"),
  year: z.enum(["1st Year", "2nd Year", "3rd Year"], {
    required_error: "Please select your year",
  }),
  college: z.string().min(2, "College is required"),
  otherCollege: z.string().optional(),
});

// Registration validation schema
const registrationSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  eventName: z.string().min(1, "Event name is required"),
  isTeamEvent: z.boolean().default(false),
  teamName: z.string().optional(),
  mainParticipant: teamMemberSchema,
  teamMembers: z.array(teamMemberSchema).optional(),
  collegeIdUrl: z.string().min(1, "College ID is required"),
  query: z.string().optional(),
});

// Generate JWT token for registration
function generateRegistrationToken(registration) {
  const payload = {
    id: registration._id.toString(),
    email: registration.mainParticipant.email,
    eventId: registration.eventId,
  };
  
  console.log('Generating registration token for:', {
    id: registration._id.toString(),
    email: registration.mainParticipant.email,
    eventId: registration.eventId,
  });
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
  
  // For debugging, also create a base64 token
  const base64Token = Buffer.from(registration.mainParticipant.email).toString('base64');
  console.log('Generated tokens:', {
    jwtToken: token.substring(0, 20) + '...',
    base64Token: base64Token
  });
  
  // Return the base64 token for compatibility with the frontend
  return base64Token;
}

// POST handler for registration
export async function POST(request) {
  try {
    // Add request body logging for debugging
    const body = await request.json().catch(error => {
      console.error('Error parsing request body:', error);
      return null;
    });
    
    if (!body) {
      return NextResponse.json({ 
        error: 'Invalid request body' 
      }, { status: 400 });
    }
    
    // Validate request body
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: validationResult.error.errors 
      }, { status: 400 });
    }
    
    const registrationData = validationResult.data;
    
    // Connect to database with better error handling
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Failed to connect to database. Please try again later.' 
      }, { status: 500 });
    }
    
    // Check if event exists
    const techelonsData = await TechelonsData.findOne({});
    if (!techelonsData) {
      return NextResponse.json({ error: 'Techelons data not found' }, { status: 404 });
    }
    
    const event = techelonsData.events.find(e => e.id === registrationData.eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    // Check if registration is open for this event
    console.log('Event registration status:', event.registrationStatus);
    if (event.registrationStatus !== 'open') {
      return NextResponse.json({ 
        error: `Registration is closed for this event. Current status: ${event.registrationStatus}` 
      }, { status: 403 });
    }
    
    // For team events, validate team size
    if (registrationData.isTeamEvent) {
      const teamSize = (registrationData.teamMembers?.length || 0) + 1; // +1 for main participant
      
      if (teamSize < event.teamSize.min) {
        return NextResponse.json({ 
          error: `Team must have at least ${event.teamSize.min} members` 
        }, { status: 400 });
      }
      
      if (teamSize > event.teamSize.max) {
        return NextResponse.json({ 
          error: `Team cannot have more than ${event.teamSize.max} members` 
        }, { status: 400 });
      }
      
      // Check for duplicate emails and phone numbers within the team
      const emails = new Set();
      const phones = new Set();
      
      // Add main participant
      emails.add(registrationData.mainParticipant.email.toLowerCase());
      phones.add(registrationData.mainParticipant.phone);
      
      // Check team members
      for (const member of registrationData.teamMembers || []) {
        const email = member.email.toLowerCase();
        const phone = member.phone;
        
        if (emails.has(email)) {
          return NextResponse.json({ 
            error: `Duplicate email address: ${email}` 
          }, { status: 400 });
        }
        
        if (phones.has(phone)) {
          return NextResponse.json({ 
            error: `Duplicate phone number: ${phone}` 
          }, { status: 400 });
        }
        
        emails.add(email);
        phones.add(phone);
      }
    }
    
    // Check if user is already registered for this event
    const existingRegistration = await TechelonsRegistration.findOne({
      eventId: registrationData.eventId,
      'mainParticipant.email': registrationData.mainParticipant.email.toLowerCase()
    });
    
    if (existingRegistration) {
      const registrationToken = generateRegistrationToken(existingRegistration);
      console.log('User already registered, returning token:', registrationToken.substring(0, 20) + '...');
      return NextResponse.json({ 
        alreadyRegistered: true,
        registrationToken,
        message: 'You are already registered for this event' 
      });
    }
    
    // Create new registration
    const registration = await TechelonsRegistration.create(registrationData);
    
    // Generate registration token
    const registrationToken = generateRegistrationToken(registration);
    console.log('New registration, returning token:', registrationToken.substring(0, 20) + '...');
    
    // Send confirmation email
    try {
      console.log('Sending confirmation email to:', registration.mainParticipant.email);
      await sendTechelonsRegistrationEmail(registration, event);
      console.log('Confirmation email sent successfully to main participant');
      
      // If it's a team event, send emails to team members
      if (registrationData.isTeamEvent && registrationData.teamMembers?.length > 0) {
        for (const member of registrationData.teamMembers) {
          console.log('Sending team member email to:', member.email);
          await sendTechelonsRegistrationEmail(
            { ...registration.toObject(), mainParticipant: member },
            event,
            true // isTeamMember flag
          );
          console.log('Team member email sent successfully');
        }
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      console.error('Email error details:', {
        message: emailError.message,
        stack: emailError.stack,
        code: emailError.code,
        command: emailError.command,
        responseCode: emailError.responseCode,
        response: emailError.response
      });
      // Continue with registration even if email fails
    }
    
    return NextResponse.json({
      success: true,
      registrationToken,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Error processing registration:', error);
    
    // Handle duplicate key error (MongoDB error code 11000)
    if (error.code === 11000) {
      return NextResponse.json({ 
        error: 'You are already registered for this event' 
      }, { status: 409 });
    }
    
    // Provide more detailed error information
    return NextResponse.json({ 
      error: 'Failed to process registration',
      message: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}

// GET handler to check registration status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Find registration
    const registration = await TechelonsRegistration.findOne({
      _id: decoded.id,
      'mainParticipant.email': decoded.email,
      eventId: decoded.eventId
    });
    
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
    console.error('Error checking registration:', error);
    return NextResponse.json({ error: 'Failed to check registration' }, { status: 500 });
  }
}
