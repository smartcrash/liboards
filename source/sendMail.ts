import nodemailer from "nodemailer";
import { MAIL_FROM_ADDRESS, MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USER } from "./constants";

export async function sendMail(to: string, { subject, html }: { subject: string, html: string }) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: false,
    auth: { user: MAIL_USER, pass: MAIL_PASSWORD },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `${MAIL_FROM_ADDRESS}`, // sender address
    to,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
