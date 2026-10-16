import { Resend } from 'resend';

// Initialize Resend with the private environment variable from Vercel
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body || {};

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address.' });
    }

    // Destination emails: supports multiple comma-separated emails
    const rawToEmails = process.env.CONTACT_RECEIVER_EMAIL || 'contact@wmlabs.ai';
    const toEmails = rawToEmails
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0);
    
    // Sender domain: can use onboarding@resend.dev initially or your verified domain
    const fromEmail = process.env.CONTACT_SENDER_EMAIL || 'WM Labs Contact <onboarding@resend.dev>';

    // Send email via Resend API
    const response = await resend.emails.send({
      from: fromEmail,
      to: toEmails,
      replyTo: email,
      subject: `[WM Labs Transmission] ${subject || 'New Contact Submission'} — from ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0c1427; color: #f8fafc; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
          <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #38bdf8; font-size: 20px; letter-spacing: 0.05em;">✦ WM LABS TRANSMISSION</h2>
            <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">New message received via the digital aquarium contact console.</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; width: 100px;">Sender:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Subject:</td>
              <td style="padding: 8px 0; color: #ffffff;">${subject || 'General Inquiry'}</td>
            </tr>
          </table>

          <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); padding: 18px; border-radius: 8px; margin-bottom: 24px;">
            <div style="color: #38bdf8; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 8px;">Message Content:</div>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; color: #e2e8f0; font-size: 14px;">${message}</p>
          </div>

          <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 14px; font-size: 12px; color: #64748b; text-align: center;">
            Direct reply will deliver to <a href="mailto:${email}" style="color: #94a3b8;">${email}</a>.
          </div>
        </div>
      `
    });

    if (response.error) {
      console.error('Resend delivery error:', response.error);
      return res.status(400).json({ success: false, error: response.error.message || 'Email delivery failed.' });
    }

    return res.status(200).json({ success: true, id: response.data?.id });
  } catch (err) {
    console.error('Contact email exception:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to send message.' });
  }
}
