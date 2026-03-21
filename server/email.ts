/**
 * Email helper using Resend's HTTP API.
 * Works in Vercel serverless (no outbound TCP/SMTP needed — pure HTTPS).
 *
 * Required env vars:
 *   RESEND_API_KEY  — from resend.com dashboard
 *   SMTP_FROM       — "From" address, e.g. support@olfly.app (must be a verified domain in Resend)
 *                     Falls back to noreply@olfly.app
 */

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = process.env.SMTP_FROM || "Olfly <noreply@olfly.app>";

function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

/**
 * Sends an email via Resend's HTTP API.
 * Returns true on success, false if not configured or on failure.
 */
export async function sendMail(opts: SendMailOptions): Promise<boolean> {
  if (!isResendConfigured()) {
    console.warn("[email] RESEND_API_KEY not set — skipping email. Add it to Vercel env vars.");
    return false;
  }

  try {
    const body: Record<string, unknown> = {
      from: FROM_ADDRESS,
      to: [opts.to],
      subject: opts.subject,
      text: opts.text,
    };
    if (opts.html) body.html = opts.html;
    if (opts.replyTo) body.reply_to = opts.replyTo;

    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[email] Resend error:", err);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[email] Failed to send email:", error);
    return false;
  }
}
