import nodemailer from "nodemailer"

// Create reusable transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail(email: string, code: string) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@bugema.ac.ug",
      to: email,
      subject: "Bugema University - Admin Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9fafb;
              }
              .header {
                background: linear-gradient(135deg, #0f766e 0%, #0891b2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background: white;
                padding: 30px;
                border-radius: 0 0 8px 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .code {
                font-size: 32px;
                font-weight: bold;
                color: #0f766e;
                text-align: center;
                padding: 20px;
                background: #f0fdfa;
                border: 2px dashed #0f766e;
                border-radius: 8px;
                margin: 20px 0;
                letter-spacing: 8px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                color: #6b7280;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Bugema University</h1>
                <p>Class Schedule Management System</p>
              </div>
              <div class="content">
                <h2>Admin Verification Code</h2>
                <p>Hello,</p>
                <p>You have requested to log in to the Bugema University Admin Portal. Please use the verification code below to complete your login:</p>
                <div class="code">${code}</div>
                <p>This code will expire in 10 minutes for security reasons.</p>
                <p>If you did not request this code, please ignore this email or contact the system administrator.</p>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Bugema University. All rights reserved.</p>
                  <p>This is an automated message, please do not reply to this email.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Bugema University - Admin Verification Code
        
        Hello,
        
        You have requested to log in to the Bugema University Admin Portal.
        
        Your verification code is: ${code}
        
        This code will expire in 10 minutes for security reasons.
        
        If you did not request this code, please ignore this email or contact the system administrator.
        
        © ${new Date().getFullYear()} Bugema University. All rights reserved.
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("[v0] Email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
