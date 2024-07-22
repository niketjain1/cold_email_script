export const createEmailBody = (details) => {
  const { firstName, companyName, toBeGeneratedByAI, uniqueFeature, jobRole } =
    details;

  return {
    subject: `Enthusiastic Developer Eager to Elevate ${companyName}`,
    body: `
<p>Hey ${firstName},</p>
<p>I hope you are doing well. I recently discovered ${companyName}, and I'm impressed by ${
      toBeGeneratedByAI === true ? "uniqueFeature" : uniqueFeature
    }.</p>
<p>A little bit about me - I worked at a startup (Numans) for the past 10 months and have worked on building new features, optimizing product performance, and reducing order fulfillment time for the operations team by making a Slack alert notification system.</p>
<p>I noticed that ${companyName} is hiring for the ${jobRole} role. I am excited about the opportunity to contribute at ${companyName}. I believe my skills and experiences align seamlessly with the company's goals.</p>
<p>Would you be open to a quick chat about the position? I'd love to share more about my qualifications. I am excited to hear from you. PFA my resume for your reference.</p>
<p>Best Regards,
<br>Niket Jain</p>
    `,
  };
};
