import { emailDetails } from "../data/variable.js";
import { createEmailBody } from "../data/constant.js";
import generateEmail from "../utils/generateEmail.js";
import generateEmailPermutations from "../utils/generateEmailPermutations.js";
import createDraft from "../utils/createDraft.js";

const main = async () => {
  const {
    firstName,
    lastName,
    domainName,
    toBeGeneratedByAI,
    uniqueFeature,
    companyName,
    jobRole,
  } = emailDetails;

  const emails = generateEmailPermutations(
    firstName.toLowerCase(),
    lastName.toLowerCase(),
    domainName.toLowerCase()
  );

  const emailBody = createEmailBody({
    firstName,
    companyName,
    toBeGeneratedByAI,
    uniqueFeature,
    jobRole,
  });

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
