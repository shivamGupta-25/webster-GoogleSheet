// Script to add workshop data to the SiteContent model
import connectToDatabase from '../lib/mongodb';
import SiteContent from '../models/SiteContent';

async function addWorkshopData() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    console.log('Fetching existing site content...');
    let content = await SiteContent.findOne({});
    
    if (!content) {
      console.log('No site content found. Creating new site content...');
      content = new SiteContent({});
    }
    
    // Workshop data
    const workshopData = {
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
    
    // Update workshop data
    content.workshop = workshopData;
    
    // Save to database
    await content.save();
    
    console.log('Workshop data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding workshop data:', error);
    process.exit(1);
  }
}

// Run the function
addWorkshopData(); 