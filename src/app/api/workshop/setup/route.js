import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';

// Default workshop data
export const defaultWorkshopData = {
  title: "Web Development Workshop",
  shortDescription: "Learn the fundamentals of web development",
  isRegistrationOpen: true,
  formSubmittedLink: "/formsubmitted/workshop",
  details: [
    {
      label: "Date",
      value: "March 25, 2023",
      id: "date"
    },
    {
      label: "Time",
      value: "10:00 AM - 4:00 PM",
      id: "time"
    },
    {
      label: "Venue",
      value: "Computer Lab, Shivaji College",
      id: "venue"
    },
    {
      label: "Registration Fee",
      value: "Free",
      id: "fee"
    }
  ],
  bannerImage: "/images/workshop-banner.jpg",
  whatsappGroupLink: "https://chat.whatsapp.com/example",
  socialMedia: {
    instagram: "https://instagram.com/websters",
    linkedin: "https://linkedin.com/company/websters"
  },
  emailNotification: {
    subject: "Workshop Registration Confirmation"
  }
};

// Helper function to set up workshop data
export async function setupWorkshopData() {
  await connectToDatabase();
  
  // Find the first document (we only have one document for site content)
  let content = await SiteContent.findOne({});
  
  // If no content exists yet, create it
  if (!content) {
    content = new SiteContent({
      workshop: defaultWorkshopData
    });
    await content.save();
    return { message: 'Workshop data created successfully', data: content.workshop };
  }
  
  // If content exists but no workshop data, add it
  if (!content.workshop) {
    content.workshop = defaultWorkshopData;
    await content.save();
    return { message: 'Workshop data added successfully', data: content.workshop };
  }
  
  // If workshop data already exists, return it
  return { message: 'Workshop data already exists', data: content.workshop };
}

export async function GET() {
  try {
    const result = await setupWorkshopData();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error setting up workshop data:', error);
    return NextResponse.json({ error: 'Failed to set up workshop data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    // Find the first document (we only have one document for site content)
    let content = await SiteContent.findOne({});
    
    // If no content exists yet, create it
    if (!content) {
      content = new SiteContent({
        workshop: body.workshop || defaultWorkshopData
      });
    } else {
      // Update workshop data
      content.workshop = body.workshop || defaultWorkshopData;
    }
    
    // Save to database
    await content.save();
    
    return NextResponse.json({ message: 'Workshop data updated successfully', data: content.workshop });
  } catch (error) {
    console.error('Error updating workshop data:', error);
    return NextResponse.json({ error: 'Failed to update workshop data' }, { status: 500 });
  }
} 