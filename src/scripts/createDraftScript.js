import { emailDetails } from "../data/variable.js";
import { emailBody } from "../data/constant.js";
import generateEmail from "../utils/generateEmail.js";
import generateEmailPermutations from "../utils/generateEmailPermutations.js";
import createDraft from "../utils/createDraft.js";

const main = async () => {
  const firstName = emailDetails.firstName;
  const lastName = emailDetails.lastName;
  const domain = emailDetails.domainName;

  const emails = generateEmailPermutations(
    firstName.toLowerCase(),
    lastName.toLowerCase(),
    domain.toLowerCase()
  );
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
