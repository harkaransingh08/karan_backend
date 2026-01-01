import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.NodeMailerUserName,
        pass: process.env.NodeMailerPassword,
    },
});

export const userOtpsend = async (email, name, otp) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.COMPANY_NAME || 'Bike Company'}" <${process.env.NODEMAILER_USER}>`,
            to: email,
            subject: `Your OTP for Secure Login - ${process.env.COMPANY_NAME || 'Bike Company'}`,
            text: `Hi ${name},\n\nYour OTP for login is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\n${process.env.COMPANY_NAME || 'Bike Company'} Team`,
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }
        
        body {
            background-color: #f5f5f5;
            padding: 20px;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background-color: #d32f2f;
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            color: white;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
            color: white;
        }
        
        .bike-icon {
            font-size: 40px;
            margin-bottom: 15px;
        }
        
        .content {
            padding: 40px 30px;
            color: #333333;
        }
        
        .greeting {
            font-size: 20px;
            margin-bottom: 20px;
            color: #212121;
        }
        
        .otp-container {
            background-color: #f8f9fa;
            border: 2px dashed #e0e0e0;
            border-radius: 8px;
            padding: 25px;
            text-align: center;
            margin: 30px 0;
        }
        
        .otp-code {
            font-size: 42px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #d32f2f;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
        }
        
        .otp-label {
            font-size: 14px;
            color: #757575;
            margin-bottom: 10px;
        }
        
        .validity {
            background-color: #e8f5e9;
            border-left: 4px solid #4caf50;
            padding: 15px;
            margin: 25px 0;
            border-radius: 4px;
        }
        
        .validity h3 {
            color: #2e7d32;
            margin-bottom: 5px;
            font-size: 16px;
        }
        
        .validity p {
            color: #424242;
            font-size: 14px;
        }
        
        .instructions {
            margin: 25px 0;
            color: #424242;
            line-height: 1.6;
        }
        
        .instructions h3 {
            color: #212121;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .instructions ul {
            padding-left: 20px;
            margin: 10px 0;
        }
        
        .instructions li {
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .warning {
            background-color: #ffebee;
            border: 1px solid #ffcdd2;
            padding: 15px;
            border-radius: 6px;
            margin: 25px 0;
            color: #c62828;
            font-size: 14px;
        }
        
        .footer {
            background-color: #212121;
            color: #bdbdbd;
            padding: 25px 30px;
            text-align: center;
            font-size: 12px;
            line-height: 1.6;
        }
        
        .company-name {
            color: #ffffff;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .contact-info {
            margin-top: 15px;
            color: #9e9e9e;
            font-size: 12px;
        }
        
        .button {
            display: inline-block;
            background-color: #4caf50;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 10px;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 25px 20px;
            }
            
            .otp-code {
                font-size: 36px;
                letter-spacing: 6px;
            }
            
            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="bike-icon">🚴‍♂️</div>
            <h1>Bike Company</h1>
            <p>Ride Safe, Ride Secure</p>
        </div>
        
        <div class="content">
            <p class="greeting">Hello <strong>${name}</strong>,</p>
            
            <p>You've requested a One-Time Password (OTP) to securely access your account.</p>
            
            <div class="otp-container">
                <div class="otp-label">Your verification code is:</div>
                <div class="otp-code">${otp}</div>
                <div class="otp-label">Enter this code to complete your login</div>
            </div>
            
            <div class="validity">
                <h3>⏰ Code Validity</h3>
                <p>This OTP is valid for <strong>5 minutes</strong>. Please use it before it expires.</p>
            </div>
            
            <div class="instructions">
                <h3>📋 How to use this code:</h3>
                <ul>
                    <li>Return to the login page on our website/app</li>
                    <li>Enter the 6-digit code shown above</li>
                    <li>Click "Verify" to complete your login</li>
                </ul>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. Our team will never ask for your OTP, password, or other sensitive information.
            </div>
            
            <p>If you didn't request this OTP, please ignore this email or contact our support team immediately.</p>
            
            <p style="margin-top: 25px;">
                Happy Riding!<br>
                <strong>The Bike Company Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <div class="company-name">${process.env.COMPANY_NAME || 'Bike Company'}</div>
            <p>Your trusted partner for all biking adventures</p>
            <div class="contact-info">
                <p>Need help? Contact our support team at ${process.env.SUPPORT_EMAIL || 'support@bikecompany.com'}</p>
                <p>© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'Bike Company'}. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
            `,
        });

        console.log("OTP email sent to:", email, "Message ID:", info.messageId);
        return { success: true, messageId: info.messageId };
    }
    catch (err) {console.error("Error sending OTP email:", err.message); }
}

