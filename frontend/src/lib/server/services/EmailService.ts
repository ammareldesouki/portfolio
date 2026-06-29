import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: parseInt(env.smtpPort),
  secure: env.smtpPort === '465',
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

export async function sendContactEmail(to: string, name: string, fromEmail: string, message: string) {
  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject: `Portfolio Contact — ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #aec6ff;">New Contact Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Name</td></tr>
          <tr><td style="padding: 0 0 16px; font-size: 16px;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Email</td></tr>
          <tr><td style="padding: 0 0 16px; font-size: 16px;">${fromEmail}</td></tr>
          <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Message</td></tr>
          <tr><td style="padding: 0 0 16px; font-size: 16px; white-space: pre-wrap;">${message}</td></tr>
        </table>
      </div>
    `,
  });
}
