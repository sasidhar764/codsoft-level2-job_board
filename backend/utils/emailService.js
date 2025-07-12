const nodemailer = require("nodemailer");

// Fix: Use createTransport instead of createTransporter
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send job application notification to employer
const sendJobApplicationNotification = async (jobData, applicantData, employerEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: employerEmail,
        subject: `New Job Application - ${jobData.title} at ${jobData.company}`,
        html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">🎉 New Job Application Received!</h2>
            <p style="color: #555;">Someone has applied for your job posting</p>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
              <h3 style="color: #1976d2; margin: 0 0 10px 0;">📋 Job Details</h3>
              <div style="text-align: left;">
                <p style="margin: 5px 0;"><strong>Position:</strong> ${jobData.title}</p>
                <p style="margin: 5px 0;"><strong>Company:</strong> ${jobData.company}</p>
                <p style="margin: 5px 0;"><strong>Location:</strong> ${jobData.location}</p>
                <p style="margin: 5px 0;"><strong>Application Date:</strong> ${new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>

            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
              <h3 style="color: #388e3c; margin: 0 0 10px 0;">👤 Applicant Information</h3>
              <div style="text-align: left;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${applicantData.name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${applicantData.email}" style="color: #2196f3; text-decoration: none;">${applicantData.email}</a></p>
                <p style="margin: 5px 0;"><strong>Applied At:</strong> ${new Date().toLocaleString()}</p>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard" 
                 style="display: inline-block; padding: 12px 24px; background: #2196f3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                View Application in Dashboard
              </a>
            </div>
            
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #f57c00; margin: 0 0 10px 0;">📝 Next Steps:</h4>
              <ul style="text-align: left; color: #666; margin: 0; padding-left: 20px;">
                <li>Log in to your dashboard to review the full application</li>
                <li>Download and review the candidate's resume</li>
                <li>Contact the candidate directly if interested</li>
                <li>Update the application status in your dashboard</li>
              </ul>
            </div>

            <p style="color: #777; font-size: 12px; margin-top: 20px;">
              This email was sent automatically by JobBoard when a candidate applied for your job posting.
              <br>© ${new Date().getFullYear()} JobBoard. All rights reserved.
            </p>
          </div>
        </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Employer notification email sent:", info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending employer notification:", error);
        return { success: false, error: error.message };
    }
};

// Send application confirmation to candidate
const sendApplicationConfirmation = async (jobData, applicantData, applicantEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: applicantEmail,
        subject: `Application Confirmed - ${jobData.title} at ${jobData.company}`,
        html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">✅ Application Submitted Successfully!</h2>
            <p style="color: #555;">Your job application has been received and the employer has been notified</p>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
              <h3 style="color: #388e3c; margin: 0 0 10px 0;">📋 Application Details</h3>
              <div style="text-align: left;">
                <p style="margin: 5px 0;"><strong>Position:</strong> ${jobData.title}</p>
                <p style="margin: 5px 0;"><strong>Company:</strong> ${jobData.company}</p>
                <p style="margin: 5px 0;"><strong>Location:</strong> ${jobData.location}</p>
                <p style="margin: 5px 0;"><strong>Applied On:</strong> ${new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p style="margin: 5px 0;"><strong>Employer:</strong> ${jobData.employer?.name || 'Company Representative'}</p>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard" 
                 style="display: inline-block; padding: 12px 24px; background: #4caf50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                View Your Applications
              </a>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #1976d2; margin: 0 0 10px 0;">🚀 What happens next?</h4>
              <ul style="text-align: left; color: #666; margin: 0; padding-left: 20px;">
                <li>The employer will review your application and resume</li>
                <li>You'll be contacted directly if they're interested</li>
                <li>You can track all your applications in your dashboard</li>
                <li>Keep applying to other positions that interest you</li>
                <li>Update your profile to increase your chances</li>
              </ul>
            </div>

            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #f57c00; margin: 0; font-weight: bold;">💡 Pro Tip:</p>
              <p style="color: #666; margin: 5px 0 0 0;">Follow up with a personalized message if you haven't heard back in a week!</p>
            </div>

            <p style="color: #777; font-size: 12px; margin-top: 20px;">
              Good luck with your application! You're one step closer to your dream job.
              <br>© ${new Date().getFullYear()} JobBoard. All rights reserved.
            </p>
          </div>
        </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Application confirmation email sent:", info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending application confirmation:", error);
        return { success: false, error: error.message };
    }
};

// Send welcome email to new users
const sendWelcomeEmail = async (userData) => {
    const isEmployer = userData.role === 'employer';
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userData.email,
        subject: `Welcome to JobBoard, ${userData.name}!`,
        html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">🎉 Welcome to JobBoard!</h2>
            <p style="color: #555;">Your account has been successfully created</p>
            
            <div style="background: ${isEmployer ? '#e3f2fd' : '#e8f5e8'}; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${isEmployer ? '#2196f3' : '#4caf50'};">
              <h3 style="color: ${isEmployer ? '#1976d2' : '#388e3c'}; margin: 0 0 10px 0;">
                ${isEmployer ? '🏢' : '👤'} Account Details
              </h3>
              <div style="text-align: left;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${userData.name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${userData.email}</p>
                <p style="margin: 5px 0;"><strong>Account Type:</strong> ${isEmployer ? 'Employer' : 'Job Seeker'}</p>
                <p style="margin: 5px 0;"><strong>Joined:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard" 
                 style="display: inline-block; padding: 12px 24px; background: ${isEmployer ? '#2196f3' : '#4caf50'}; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
            
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #f57c00; margin: 0 0 10px 0;">🚀 Get Started:</h4>
              <ul style="text-align: left; color: #666; margin: 0; padding-left: 20px;">
                ${isEmployer ? `
                  <li>Complete your company profile</li>
                  <li>Post your first job opening</li>
                  <li>Review and manage applications</li>
                  <li>Connect with talented candidates</li>
                ` : `
                  <li>Complete your profile and upload your resume</li>
                  <li>Browse and apply for jobs</li>
                  <li>Track your applications in the dashboard</li>
                  <li>Set up job alerts for your preferences</li>
                `}
              </ul>
            </div>

            <p style="color: #777; font-size: 12px; margin-top: 20px;">
              Welcome aboard! We're excited to help you ${isEmployer ? 'find the perfect candidates' : 'find your dream job'}.
              <br>© ${new Date().getFullYear()} JobBoard. All rights reserved.
            </p>
          </div>
        </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent:", info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending welcome email:", error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendJobApplicationNotification,
    sendApplicationConfirmation,
    sendWelcomeEmail
};
