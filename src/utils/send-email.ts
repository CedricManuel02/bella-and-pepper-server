import dotenv from "dotenv";
import nodemailer from 'nodemailer';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_GMAIL_EMAIL,
    pass: process.env.APP_GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify(function ( error, success) {
  if (error) {
    console.log("This is error");
  } else {
    console.log("Server is ready to take our messages");
  }
});

export async function createGmailSendingService(to: string, type: string, token_hash: string) {
  const from = {
    name: "Bella and Pepper Korean E-commerce",
    address: process.env.APP_GMAIL_EMAIL,
  };

  let subject = "";
  let text = "";
  let html = "";

  switch (type) {
    case "FORGOT_PASSWORD":
      subject = "Forgot your password? Reset it now!";
      html = `
        <p>We received a request to reset your password. If you didn't make this request, you can ignore this email. To reset your password, please click the link below:</p>
        <a href="${process.env.APP_FRONT_END_URL}/reset-password?token=${token_hash}" style="color: #4CAF50; text-decoration: none;">Reset Password</a>
      `;
      break;

    default:
      throw new Error("Unknown email type");
  }

  const mailOptions = {
    from: `${from.name} <${from.address}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Something went wrong while sending email:", error);
    return false;
  }
}
