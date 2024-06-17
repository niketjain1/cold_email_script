import { google } from "googleapis";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { emailDetails } from "../data/variable.js";
import { emailBody } from "../data/constant.js";
import generateEmail from "../utils//generateEmail.js";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const generateEmailPermutations = (firstName, lastName, domain) => {
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
};

const makeBody = (to, from, subject, message, attachmentPath) => {
  const boundary = "foo_bar_baz";
  const fileName = path.basename(attachmentPath);

  let str = [
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    `MIME-Version: 1.0`,
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `\r\n--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `MIME-Version: 1.0`,
    `Content-Transfer-Encoding: 7bit`,
    `\r\n${message}`,
  ].join("\n");

  if (attachmentPath) {
    const fileContent = fs.readFileSync(attachmentPath).toString("base64");
    str += [
      `\r\n--${boundary}`,
      `Content-Type: application/pdf; name="${fileName}"`,
      `MIME-Version: 1.0`,
      `Content-Transfer-Encoding: base64`,
      `Content-Disposition: attachment; filename="${fileName}"`,
      `\r\n${fileContent}`,
    ].join("\n");
  }

  str += `\r\n--${boundary}--`;

  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const createDraft = async (toEmails, subject, text, attachmentPath) => {
  try {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    const raw = makeBody(
      toEmails.join(","),
      "your-email@gmail.com",
      subject,
      text,
      attachmentPath
    );

    const draft = await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: {
          raw: raw,
        },
      },
    });

    return draft;
  } catch (error) {
    console.log("Error creating draft:", error);
    throw error;
  }
};

const main = async () => {
  const firstName = emailDetails.firstName;
  const lastName = emailDetails.lastName;
  const domain = emailDetails.domainName;

  const emails = generateEmailPermutations(firstName, lastName, domain);
  const subject = emailBody.subject;
  let body = emailBody.body;
  const attachmentPath = process.env.ATTACHMENT_PATH;

  if (emailDetails.toBeGeneratedByAI) {
    console.log("Generating unique feature using AI...");
    const generatedFeature = await generateEmail(
      body,
      emailDetails.companyName
    );
    if (generatedFeature) {
      body = body.replace("uniqueFeature.", generatedFeature);
    }
  }
  try {
    const result = await createDraft(emails, subject, body, attachmentPath);
    console.log(`Draft created for ${emails.join(", ")}:`, result.data);
  } catch (error) {
    console.log(`Failed to create draft for ${emails.join(", ")}:`, error);
  }
};

main();
