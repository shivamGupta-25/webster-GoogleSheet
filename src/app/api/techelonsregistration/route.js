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

// Helper function to safely check for duplicates within the same team
function checkInternalDuplicates(registrationData) {
  try {
    const emails = new Set();
    const phones = new Set();
    
    // Add main participant if valid
    if (registrationData.mainParticipant?.email) {
      emails.add(registrationData.mainParticipant.email.toLowerCase());
    }
    
    if (registrationData.mainParticipant?.phone) {
      phones.add(registrationData.mainParticipant.phone);
    }
    
    // Check team members
    for (const member of registrationData.teamMembers || []) {
      if (!member || !member.email || !member.phone) continue;
      
      const email = member.email.toLowerCase();
      const phone = member.phone;
      
      if (emails.has(email)) {
        return { 
          error: true,
          message: `You cannot use the same email address (${email}) for multiple team members. Each team member must have a unique email address.`,
          type: 'duplicate_email'
        };
      }
      
      if (phones.has(phone)) {
        return { 
          error: true,
          message: `You cannot use the same phone number (${phone}) for multiple team members. Each team member must have a unique phone number.`,
          type: 'duplicate_phone'
        };
      }
      
      emails.add(email);
      phones.add(phone);
    }
    
    return { error: false };
  } catch (error) {
    console.error('Error in checkInternalDuplicates:', error);
    return { error: false }; // Continue with registration even if check fails
  }
}

// POST handler for registration
export async function POST(request) {
  try {
    console.log('Starting techelons registration process');
    
    // Add request body logging for debugging
    const body = await request.json().catch(error => {
      console.error('Error parsing request body:', error);
      return null;
    });
    
    if (!body) {
      console.error('Invalid request body received');
      return NextResponse.json({ 
        error: 'Invalid request body' 
      }, { status: 400 });
    }
    
    // Validate request body
    console.log('Validating request body');
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation errors:', JSON.stringify(validationResult.error.errors));
      return NextResponse.json({ 
        error: 'Validation error', 
        details: validationResult.error.errors 
      }, { status: 400 });
    }
    
    const registrationData = validationResult.data;
    console.log(`Processing registration for event: ${registrationData.eventId}, isTeamEvent: ${registrationData.isTeamEvent}`);
    
    // Connect to database with better error handling
    try {
      console.log('Connecting to database');
      await connectToDatabase();
      console.log('Database connection successful');
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
      
      // Check for duplicate emails and phone numbers within the team using helper function
      const internalDuplicateCheck = checkInternalDuplicates(registrationData);
      if (internalDuplicateCheck.error) {
        return NextResponse.json({ 
          error: internalDuplicateCheck.message 
        }, { status: 400 });
      }

      // Now also check if any team members' emails or phones are already registered for this event
      if (registrationData.teamMembers && registrationData.teamMembers.length > 0) {
        try {
          // Extract all emails and phones to check (filter out any empty values)
          const teamMemberEmails = registrationData.teamMembers
            .map(member => member.email?.toLowerCase())
            .filter(email => email);
          
          const teamMemberPhones = registrationData.teamMembers
            .map(member => member.phone)
            .filter(phone => phone);
            
          // Skip check if there are no valid emails or phones to check
          if (teamMemberEmails.length > 0) {
            // Check for existing registrations with team member emails in a single query
            const existingEmailRegistrations = await TechelonsRegistration.findOne({
              eventId: registrationData.eventId,
              $or: [
                { 'mainParticipant.email': { $in: teamMemberEmails } },
                { 'teamMembers.email': { $in: teamMemberEmails } }
              ]
            }, { 'mainParticipant.email': 1, 'teamMembers.email': 1 });
            
            if (existingEmailRegistrations) {
              // Determine which email caused the conflict
              let conflictEmail = '';
              
              // Check if the conflict is with a main participant
              const mainEmail = existingEmailRegistrations.mainParticipant?.email?.toLowerCase();
              if (mainEmail && teamMemberEmails.includes(mainEmail)) {
                conflictEmail = mainEmail;
              } else {
                // Check if conflict is with a team member
                for (const member of existingEmailRegistrations.teamMembers || []) {
                  const memberEmail = member.email?.toLowerCase();
                  if (memberEmail && teamMemberEmails.includes(memberEmail)) {
                    conflictEmail = memberEmail;
                    break;
                  }
                }
              }
              
              // Get more information about the existing registration for better error message
              let detailedMessage = `The email address ${conflictEmail || 'provided'} is already registered for this event.`;
              
              try {
                // Find the full registration details to provide more context
                const fullRegistrationDetails = await TechelonsRegistration.findOne({
                  eventId: registrationData.eventId,
                  $or: [
                    { 'mainParticipant.email': conflictEmail },
                    { 'teamMembers.email': conflictEmail }
                  ]
                });
                
                if (fullRegistrationDetails) {
                  const isMainParticipant = fullRegistrationDetails.mainParticipant.email.toLowerCase() === conflictEmail.toLowerCase();
                  const participantName = isMainParticipant 
                    ? fullRegistrationDetails.mainParticipant.name
                    : fullRegistrationDetails.teamMembers.find(m => m.email.toLowerCase() === conflictEmail.toLowerCase())?.name;
                  
                  detailedMessage = `The email address ${conflictEmail} is already registered for "${event.name}" ${
                    fullRegistrationDetails.isTeamEvent 
                      ? `as part of team "${fullRegistrationDetails.teamName || 'Unnamed Team'}"` 
                      : `as an individual participant`
                  }${participantName ? ` under the name "${participantName}"` : ''}.`;
                }
              } catch (detailError) {
                console.error('Error getting detailed registration info:', detailError);
                // Fall back to basic error message if detailed lookup fails
              }
              
              return NextResponse.json({ 
                error: detailedMessage
              }, { status: 400 });
            }
          }
          
          // Skip check if there are no valid phones to check
          if (teamMemberPhones.length > 0) {
            // Check for existing registrations with team member phones in a single query
            const existingPhoneRegistrations = await TechelonsRegistration.findOne({
              eventId: registrationData.eventId,
              $or: [
                { 'mainParticipant.phone': { $in: teamMemberPhones } },
                { 'teamMembers.phone': { $in: teamMemberPhones } }
              ]
            }, { 'mainParticipant.phone': 1, 'teamMembers.phone': 1 });
            
            if (existingPhoneRegistrations) {
              // Determine which phone caused the conflict
              let conflictPhone = '';
              
              // Check if the conflict is with a main participant
              const mainPhone = existingPhoneRegistrations.mainParticipant?.phone;
              if (mainPhone && teamMemberPhones.includes(mainPhone)) {
                conflictPhone = mainPhone;
              } else {
                // Check if conflict is with a team member
                for (const member of existingPhoneRegistrations.teamMembers || []) {
                  const memberPhone = member.phone;
                  if (memberPhone && teamMemberPhones.includes(memberPhone)) {
                    conflictPhone = memberPhone;
                    break;
                  }
                }
              }
              
              // Get more information about the existing registration for better error message
              let detailedMessage = `The phone number ${conflictPhone || 'provided'} is already registered for this event.`;
              
              try {
                // Find the full registration details to provide more context
                const fullRegistrationDetails = await TechelonsRegistration.findOne({
                  eventId: registrationData.eventId,
                  $or: [
                    { 'mainParticipant.phone': conflictPhone },
                    { 'teamMembers.phone': conflictPhone }
                  ]
                });
                
                if (fullRegistrationDetails) {
                  const isMainParticipant = fullRegistrationDetails.mainParticipant.phone === conflictPhone;
                  const participantName = isMainParticipant 
                    ? fullRegistrationDetails.mainParticipant.name
                    : fullRegistrationDetails.teamMembers.find(m => m.phone === conflictPhone)?.name;
                  
                  detailedMessage = `The phone number ${conflictPhone} is already registered for "${event.name}" ${
                    fullRegistrationDetails.isTeamEvent 
                      ? `as part of team "${fullRegistrationDetails.teamName || 'Unnamed Team'}"` 
                      : `as an individual participant`
                  }${participantName ? ` under the name "${participantName}"` : ''}.`;
                }
              } catch (detailError) {
                console.error('Error getting detailed registration info for phone:', detailError);
                // Fall back to basic error message if detailed lookup fails
              }
              
              return NextResponse.json({ 
                error: detailedMessage
              }, { status: 400 });
            }
          }
        } catch (checkError) {
          console.error('Error checking for team member duplicates:', checkError);
          // Continue with registration even if the duplicate check fails
          // This is better than preventing valid registrations due to an error in the check
        }
      }
    }
    
    // Check if user is already registered for this event by email
    const existingRegistrationByEmail = await TechelonsRegistration.findOne({
      eventId: registrationData.eventId,
      'mainParticipant.email': registrationData.mainParticipant.email.toLowerCase()
    });
    
    if (existingRegistrationByEmail) {
      const registrationToken = generateRegistrationToken(existingRegistrationByEmail);
      console.log('User already registered with this email, returning token:', registrationToken.substring(0, 20) + '...');
      
      // Create a more detailed message
      let detailedMessage = 'You are already registered for this event with this email address.';
      
      try {
        // Add details about the registration
        detailedMessage = `The email address ${registrationData.mainParticipant.email} is already registered for "${event.name}" ${
          existingRegistrationByEmail.isTeamEvent 
            ? `as ${existingRegistrationByEmail.mainParticipant.email.toLowerCase() === registrationData.mainParticipant.email.toLowerCase() 
                ? `the team leader of "${existingRegistrationByEmail.teamName || 'Unnamed Team'}"` 
                : `a team member in "${existingRegistrationByEmail.teamName || 'Unnamed Team'}"`}`
            : `as an individual participant`
        } under the name "${existingRegistrationByEmail.mainParticipant.name}".`;
      } catch (detailError) {
        console.error('Error creating detailed message for email:', detailError);
        // Fall back to basic message
      }
      
      return NextResponse.json({ 
        alreadyRegistered: true,
        registrationToken,
        message: detailedMessage
      });
    }
    
    // Check if user is already registered for this event by phone number
    const existingRegistrationByPhone = await TechelonsRegistration.findOne({
      eventId: registrationData.eventId,
      'mainParticipant.phone': registrationData.mainParticipant.phone
    });
    
    if (existingRegistrationByPhone) {
      const registrationToken = generateRegistrationToken(existingRegistrationByPhone);
      console.log('User already registered with this phone number, returning token:', registrationToken.substring(0, 20) + '...');
      
      // Create a more detailed message
      let detailedMessage = 'You are already registered for this event with this phone number.';
      
      try {
        // Add details about the registration
        detailedMessage = `The phone number ${registrationData.mainParticipant.phone} is already registered for "${event.name}" ${
          existingRegistrationByPhone.isTeamEvent 
            ? `as ${existingRegistrationByPhone.mainParticipant.phone === registrationData.mainParticipant.phone 
                ? `the team leader of "${existingRegistrationByPhone.teamName || 'Unnamed Team'}"` 
                : `a team member in "${existingRegistrationByPhone.teamName || 'Unnamed Team'}"`}`
            : `as an individual participant`
        } under the name "${existingRegistrationByPhone.mainParticipant.name}".`;
      } catch (detailError) {
        console.error('Error creating detailed message for phone:', detailError);
        // Fall back to basic message
      }
      
      return NextResponse.json({ 
        alreadyRegistered: true,
        registrationToken,
        message: detailedMessage
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
    console.error('Error details:', {
      message: error.message || 'No message',
      name: error.name || 'No name',
      stack: error.stack || 'No stack trace',
      code: error.code || 'No error code'
    });
    
    // Handle duplicate key error (MongoDB error code 11000)
    if (error.code === 11000) {
      console.log('MongoDB duplicate key error detected');
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
