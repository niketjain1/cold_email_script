import { emailDetails } from "../data/varable";

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

const emails = generateEmailPermutations(
  emailDetails.firstName.toLowerCase(),
  emailDetails.lastName.toLowerCase(),
  emailDetails.domainName.toLowerCase()
);

const main = async () => {
  const firstName = emailDetails.firstName;
  const lastName = emailDetails.lastName;
  const domain = emailDetails.domainName;

  const emails = generateEmailPermutations(firstName, lastName, domain);
  const subject = emailBody.subject;
  const body = emailBody.body;
  const attachmentPath = `C:Users\niket\Documents\Niket Jain Resume.pdf`;

  try {
    const result = await sendEmail(emails, subject, body, attachmentPath);
    console.log(`Email sent to ${emails.join(", ")}:`, result);
  } catch (error) {
    console.log(`Failed to send email to ${emails.join(", ")}:`, error);
  }
};

main();
