// ==================== Module Imports & Dependencies ====================

import nodemailer from "nodemailer";


// ==================== Send Email Utility Function ====================

export async function sendEmail({
  to = "", 
   text="",
   html="",
   subject = "",
  attachments = [],
    cc,
    bcc,
  }){


    // ==================== Create Nodemailer Transporter (Gmail Service) ====================

    const transporter = nodemailer.createTransport({ 
        service:"gmail",//or outlook
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,  
        },
    });


    // ==================== Send Email with Provided Options ====================

    const info = await transporter.sendMail({
        from: `"sarahaapp@gmail.com " <${process.env.EMAIL}>`,
        to,
        attachments,
        subject,
        text, // plain‑text body
        html, // HTML body
        cc,
        bcc,
    });


    // ==================== Log Success Message ====================

    console.log("Message sent:", info.messageId);
};


// ==================== Email Subject Constants ====================

export const emailSubject = {
  confirmEmail: "Confirm Your Email",
  resetPassword: "Reset you password",
  welcome: "welcome to sarahaaaa"
}