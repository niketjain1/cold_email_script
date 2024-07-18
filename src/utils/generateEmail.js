import OpenAI from "openai";
import Instructor from "@instructor-ai/instructor";
import { z } from "zod";

const generateEmail = async (emailBody, companyName) => {
  const emailSchema = z.object({
    emailBody: z.string(),
    uniqueFeature: z.string(),
  });
  const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const client = Instructor({
    client: openAI,
    mode: "FUNCTIONS",
  });

  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
        You are an AI that generates a unique feature for a company to be included in a cold email.
        
        Input:
        - A cold email seeking job opportunities for the company ${companyName}.
        - The email body: ${emailBody}

        Output:
        - Generate a unique feature of the company ${companyName} that would be impressive to mention in a cold email.
        - Only provide the unique feature without altering the email body.
        - The unique feature should be appropriate and relevant to the company ${companyName}.
        `,
      },
    ],
    model: "gpt-4o",
    response_model: {
      schema: emailSchema,
      name: "emailResponse",
    },
  });

  if (response.uniqueFeature.length === 0) {
    console.warn(
      "Failed to generate email response due to an invalid API response"
    );
    return null;
  }

  return response.uniqueFeature;
};

export default generateEmail;
