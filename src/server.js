import express from "express";
import cors from "cors";
import generateEmailPermutations from "./utils/generateEmailPermutations.js";
import { createEmailBody } from "./data/constant.js";
import generateEmail from "./utils/generateEmail.js";
import createDraft from "./utils/createDraft.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-draft", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      domainName,
      toBeGeneratedByAI,
      uniqueFeature,
      companyName,
      jobRole,
    } = req.body;

    const attachmentPath = process.env.ATTACHMENT_PATH;

    // Generate email permutations
    const emails = generateEmailPermutations(
      firstName.toLowerCase(),
      lastName.toLowerCase(),
      domainName.toLowerCase()
    );

    const emailBody = createEmailBody({
      firstName,
      lastName,
      toBeGeneratedByAI,
      uniqueFeature,
      companyName,
      jobRole,
    });

    const subject = emailBody.subject;
    let body = emailBody.body;

    if (toBeGeneratedByAI) {
      // Call your AI generation function here
      console.log("Generating unique feature using AI...");
      const generatedFeature = await generateEmail(body, companyName);
      if (generatedFeature) {
        body = body.replace("uniqueFeature.", generatedFeature);
      }
    } else {
      body = body.replace("uniqueFeature.", uniqueFeature);
    }

    // Create draft
    const result = await createDraft(emails, subject, body, attachmentPath);
    res.json({
      draftId: result.draftData.id,
      emailContent: result.emailContent,
    });
  } catch (error) {
    console.error("Error creating draft:", error);
    res.status(500).json({ error: "Failed to create draft" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
