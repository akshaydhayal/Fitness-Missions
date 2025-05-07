import nodemailer from "nodemailer";

export async function POST(request:Request) {
  try {
    const { email,inviterName,title,description,type,deadline,missionId } = await request.json(); // Get email details from the request body

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email provider (e.g., 'SendGrid', 'Mailgun', etc.)
      auth: {
        user: process.env.EMAIL_USER, // Your email address (use environment variables)
        pass: process.env.EMAIL_PASS, // Your email password (use environment variables)
      },
    });

    // Define the email options
    const emailContent = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mission Invitation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2c3e50;
        }
        .mission-details {
            background-color: #f8f9fa;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin: 20px 0;
        }
        .cta-button {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>Cudis Fitness Mission Invitation</h1>
    <p>Hello, You've been invited by <strong>${inviterName}</strong> to join the "<strong>${title}</strong>" mission!</p>
    
    <div class="mission-details">
        <h2>Mission Details:</h2>
        <ul>
            <li><strong>Title:</strong> ${title}</li>
            <li><strong>Description:</strong> ${description}</li>
            <li><strong>Type:</strong> ${type}</li>
            <li><strong>Mission Deadline:</strong> ${deadline}</li>
        </ul>
    </div>
    
    <p>To join this mission, please click on the following link:</p>
    <a href="https://cudis-missions.vercel.app/missions/${missionId}" class="cta-button">Join Mission</a>
    
    <p>We hope to see you participate!</p>
    
    <p>Best regards,<br>Cudis Team</p>
</body>
</html>
    `;
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email address
      to:email, // Recipient email address (provided in the request)
      subject:"Invitation to join a Cudis Fitness Mission", // Email subject
      text:"I am inviring ypu to this mission", // Plain text body
      html:emailContent, // HTML body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Email sent: ${info.response}`,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // Handle any errors
    return new Response(
      JSON.stringify({
        success: false,
        message: error,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
