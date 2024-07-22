import path from "path";
import fs from "fs";

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

  const readableContent = `To: ${to}\nFrom: ${from}\nSubject: ${subject}\n\n${message}`;

  return {
    raw: Buffer.from(str)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_"),
    readable: readableContent,
  };
};

export default makeBody;
