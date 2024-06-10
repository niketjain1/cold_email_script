import { emailDetails } from "./varable";

export const emailBody = {
  subject: `Enthusiastic Developer Eager to Elevate ${emailDetails.companyName}`,
  body: `
    Hey ${emailDetails.firstName},
    
    I hope you are doing well. I recently discovered ${emailDetails.companyName}, and I'm impressed by ${emailDetails.uniqueFeature}
    
    A little bit about me - I worked at a startup (Numans) for the past 10 months and have worked on building new features, optimizing product performance, and reducing order fulfillment time for the operations team by making a Slack alert notification system.
    
    I noticed that ${emailDetails.companyName} is hiring for the ${emailDetails.jobRole} role. I am excited about the opportunity to contribute at ${emailDetails.companyName}. I believe my skills and experiences align seamlessly with the company's goals.
    
    Would you be open to a quick chat about the position? I'd love to share more about my qualifications. I am excited to hear from you. PFA my resume for your reference.
    
    Best Regards,
    Niket Jain
    `,
};
