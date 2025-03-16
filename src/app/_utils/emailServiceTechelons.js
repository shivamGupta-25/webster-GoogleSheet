import nodemailer from 'nodemailer';

// Create a transporter object with Gmail settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send a confirmation email for Techelons registration
 * @param {Object} registration - The registration data
 * @param {Object} event - The event data
 * @param {Boolean} isTeamMember - Whether the recipient is a team member (not the main participant)
 */
export async function sendTechelonsRegistrationEmail(registration, event, isTeamMember = false) {
  const recipient = isTeamMember ? registration.mainParticipant : registration.mainParticipant;
  
  // Format date and time
  const eventDate = event.date || 'TBA';
  const eventTime = event.time || 'TBA';
  const eventVenue = event.venue || 'TBA';
  
  // Create email subject
  const subject = `Registration Confirmation: ${event.name} - Techelons`;
  
  // Create email content
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4f46e5;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .details {
          margin: 20px 0;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4f46e5;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 15px;
        }
        .whatsapp {
          background-color: #25D366;
        }
        h2 {
          color: #4f46e5;
        }
        ul {
          padding-left: 20px;
        }
        .team-info {
          margin-top: 15px;
          padding: 10px;
          background-color: #f0f0f0;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Registration Confirmation</h1>
      </div>
      <div class="content">
        <p>Dear ${recipient.name},</p>
        
        <p>Thank you for registering for <strong>${event.name}</strong> at Techelons!</p>
        
        ${isTeamMember ? 
          `<p>You have been registered as a team member for team <strong>${registration.teamName || 'N/A'}</strong>.</p>` : 
          registration.isTeamEvent ? 
            `<p>You have successfully registered your team <strong>${registration.teamName || 'N/A'}</strong>.</p>` : 
            '<p>Your registration has been confirmed.</p>'
        }
        
        <div class="details">
          <h2>Event Details</h2>
          <ul>
            <li><strong>Event:</strong> ${event.name}</li>
            ${event.tagline ? `<li><strong>Tagline:</strong> <em>${event.tagline}</em></li>` : ''}
            <li><strong>Date:</strong> ${eventDate}</li>
            <li><strong>Time:</strong> ${eventTime}</li>
            <li><strong>Venue:</strong> ${eventVenue}</li>
            ${event.category ? `<li><strong>Category:</strong> ${event.category}</li>` : ''}
          </ul>
          
          ${registration.isTeamEvent && !isTeamMember ? `
            <div class="team-info">
              <h3>Team Information</h3>
              <p><strong>Team Name:</strong> ${registration.teamName || 'N/A'}</p>
              <p><strong>Team Size:</strong> ${(registration.teamMembers?.length || 0) + 1}</p>
            </div>
          ` : ''}
        </div>
        
        ${event.instructions ? `
          <h2>Instructions</h2>
          <p>${event.instructions}</p>
        ` : ''}
        
        ${event.rules && event.rules.length > 0 ? `
          <h2>Rules</h2>
          <ul>
            ${event.rules.map(rule => `<li>${rule}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${event.competitionStructure && event.competitionStructure.length > 0 ? `
          <h2>Competition Structure</h2>
          <ol>
            ${event.competitionStructure.map(item => `<li>${item}</li>`).join('')}
          </ol>
        ` : ''}
        
        ${event.evaluationCriteria && event.evaluationCriteria.length > 0 ? `
          <h2>Evaluation Criteria</h2>
          <ul>
            ${event.evaluationCriteria.map(criterion => `<li>${criterion}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${event.whatsappGroup ? `
          <p>Join our WhatsApp group for updates and communication:</p>
          <a href="${event.whatsappGroup}" class="button whatsapp" target="_blank">Join WhatsApp Group</a>
        ` : ''}
        
        <p>If you have any questions, please feel free to contact the event coordinators:</p>
        <ul>
          ${event.coordinators && event.coordinators.map(coordinator => `
            <li><strong>${coordinator.name}</strong> - ${coordinator.phone} (${coordinator.email})</li>
          `).join('')}
        </ul>
        
        <p>We look forward to seeing you at the event!</p>
        
        <p>Best regards,<br>Techelons Team</p>
      </div>
      <div class="footer">
        <p>This is an automated email. Please do not reply to this message.</p>
        <p>&copy; ${new Date().getFullYear()} Techelons, Shivaji College. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
  
  // Email options
  const mailOptions = {
    from: `"Techelons" <${process.env.EMAIL_USER}>`,
    to: recipient.email,
    subject: subject,
    html: htmlContent,
  };
  
  // Send email
  return transporter.sendMail(mailOptions);
} 