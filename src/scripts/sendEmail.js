const { google } = require("googleapis");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { emailDetails } = require("./variables");
const { emailBody } = require("./constants");

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = process.env;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

function generateEmailPermutations(firstName, lastName, domain) {
  const variations = [
    `${firstName}`,
    `${firstName[0]}`,
    `${firstName}.${lastName}`,
    `${firstName[0]}.${lastName}`,
    `${firstName}${lastName[0]}`,
    `${firstName}${lastName}`,
    `${firstName}_${lastName}`,
    `${firstName}.${lastName[0]}`,
  ];

  return variations.map((variation) => `${variation}@${domain}`);
}

async function sendEmail(toEmails, subject, text, attachmentPath) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "niketj2000@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: "niketj2000@gmail.com",
      to: toEmails.join(","),
      subject: subject,
      text: text,
      attachments: [
        {
          path: attachmentPath,
        },
      ],
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
}

async function main() {
  const firstName = emailDetails.firstName;
  const lastName = emailDetails.lastName;
  const domain = emailDetails.domainName;
  const companyName = emailDetails.companyName;
  const receiverName = emailDetails.firstName;
  const uniqueFeature = emailDetails.uniqueFeature;

  const emails = generateEmailPermutations(firstName, lastName, domain);
  const subject = emailBody.subject;
  const body = emailBody.body;
  const attachmentPath = "/path/to/your/resume.pdf";

  try {
    const result = await sendEmail(emails, subject, body, attachmentPath);
    console.log(`Email sent to ${emails.join(", ")}:`, result);
  } catch (error) {
    console.log(`Failed to send email to ${emails.join(", ")}:`, error);
  }
}

main();
