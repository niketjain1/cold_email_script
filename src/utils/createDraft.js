import { google } from "googleapis";
import dotenv from "dotenv";
import makeBody from "./makeBody.js";

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
          raw: raw.raw,
        },
      },
    });

    return {
      draftData: draft.data,
      emailContent: raw.readable,
    };
  } catch (error) {
    console.log("Error creating draft:", error);
    throw error;
  }
};

export default createDraft;
