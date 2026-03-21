import nodemailer from "nodemailer";

/**
 * Lazy-initialized nodemailer transporter.
 * Reads SMTP credentials from environment variables:
 *
 *   SMTP_HOST     — e.g. smtp.sendgrid.net / smtp.mailgun.org / smtp.gmail.com
 *   SMTP_PORT     — e.g. 587 (default)
 *   SMTP_USER     — SMTP username / API key
 *   SMTP_PASS     — SMTP password / API key secret
 *   SMTP_FROM     — "From" address, defaults to noreply@olfly.app
 *
 * If credentials are missing the helper logs a warning and skips sending,
 * so the endpoint still returns success and saves to the DB.
 */

const SMTP_FROM = process.env.SMTP_FROM || "noreply@olfly.app";

function isSmtpConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

/**
 * Sends an email. Returns true on success, false if SMTP is not configured
 * or if sending fails (error is logged but not thrown).
 */
export async function sendMail(opts: SendMailOptions): Promise<boolean> {
  if (!isSmtpConfigured()) {
    console.warn("[email] SMTP not configured — skipping email send. Set SMTP_HOST, SMTP_USER, SMTP_PASS.");
    return false;
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: SMTP_FROM,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    return true;
  } catch (error) {
    console.error("[email] Failed to send email:", error);
    return false;
  }
}
