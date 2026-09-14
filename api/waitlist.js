// Vercel Serverless Function: /api/waitlist
// Receives the waitlist form submission from landing.html, writes it to
// Google Sheets, then sends a confirmation email via Resend.
//
// Required environment variables (set in Vercel: Settings > Environment Variables):
//   RESEND_API_KEY      — your Resend secret API key
//   WAITLIST_SHEETS_URL — the Google Apps Script /exec URL (waitlist-apps-script.gs)

const WAITLIST_SHEETS_URL =
  process.env.WAITLIST_SHEETS_URL ||
  'https://script.google.com/macros/s/AKfycbyVs1KG6u1DSYMPE4shnBvJbFXenV02Cm6vZ6LW3aZkOAFVGWT8-aAFvpi5SA5e3K0D/exec';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_ADDRESS = 'Harbourly <hello@harbourly.gg>';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { role, games, country, name, email, reason } = req.body || {};

  if (!role || !name || !email) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // 1. Write to Google Sheets (server-to-server — no CORS concerns here).
  let sheetResult = { result: 'success' };
  try {
    const sheetsRes = await fetch(WAITLIST_SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, games, country, name, email, reason })
    });
    sheetResult = await sheetsRes.json();
  } catch (err) {
    console.error('Sheets write failed:', err);
    // Don't block signup on a Sheets hiccup — fall through and still try the email.
  }

  if (sheetResult.result === 'duplicate') {
    res.status(200).json({ result: 'duplicate' });
    return;
  }

  // 2. Send confirmation email via Resend.
  if (RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: FROM_ADDRESS,
          to: email,
          subject: `You're on the Harbourly waitlist, ${name}!`,
          html: buildEmailHtml()
        })
      });
    } catch (err) {
      console.error('Resend send failed:', err);
      // Signup already recorded in Sheets — don't fail the whole request over email.
    }
  } else {
    console.warn('RESEND_API_KEY not set — skipping confirmation email.');
  }

  res.status(200).json({ result: 'success' });
};

function buildEmailHtml() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Harbourly</title>
</head>
<body style="margin:0;padding:0;background-color:#030b17;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#030b17" style="background-color:#030b17;background-image:linear-gradient(rgba(148,163,184,0.056) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,0.056) 1px,transparent 1px);background-size:32px 32px;background-position:center -1px;">

<tr>
<td align="center" style="padding:48px 20px 60px 20px;">

<!-- panel, sitting on top of the grid background -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;">
<tr>
<td bgcolor="#0b1628" style="background-color:#0b1628;border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

<!-- glowing top border: built from a radial gradient (not box-shadow) so the glow itself actually renders in clients like Gmail that strip box-shadow -->
<tr>
<td height="18" style="height:18px;line-height:18px;font-size:0;background:radial-gradient(ellipse 60% 100% at center top,rgba(34,214,111,0.55) 0%,rgba(34,214,111,0.18) 45%,transparent 75%);">&nbsp;</td>
</tr>

<tr>
<td align="center" style="padding:36px 40px 8px 40px;">
<img src="https://www.harbourly.gg/Images/logo&amp;word-mark.png" width="220" height="57" alt="Harbourly" border="0" style="display:block;width:220px;height:57px;" />
</td>
</tr>

<tr>
<td style="padding:28px 48px 0 48px;">
<p style="margin:0 0 18px 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:1.65;color:#b6c2d4;text-align:center;">Thank you for signing up with us on Harbourly.gg! We're building Southeast Asia's first esports coaching marketplace, and we're thrilled to have you on board &#10084;&#65039;</p>
<p style="margin:0 0 18px 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:1.65;color:#b6c2d4;text-align:center;">You'll be the first to be notified of any new updates, features or even offers, so stick around with us until then.</p>
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:1.65;color:#b6c2d4;text-align:center;">In the meantime, join our Discord to be part of our community of gamers and coaches, and to help us build something truly worthwhile &#129305;&#128584;</p>
</td>
</tr>

<tr>
<td style="padding:32px 48px 0 48px;">
<div style="height:1px;line-height:1px;font-size:0;background-color:rgba(255,255,255,0.07);">&nbsp;</div>
</td>
</tr>

<tr>
<td align="center" style="padding:16px 40px 26px 40px;">
<!-- aura ring built from a radial gradient, so the glow shows up in clients (Gmail included) that strip box-shadow -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="padding:26px;background:radial-gradient(ellipse at center,rgba(34,214,111,0.32) 0%,rgba(34,214,111,0.12) 45%,transparent 72%);">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" bgcolor="#22d66f" style="background-color:#22d66f;border-radius:999px;box-shadow:0 0 40px 4px rgba(34,214,111,0.4),0 12px 30px rgba(34,214,111,0.45);">
<a href="https://discord.gg/bKnBZY4sfV" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:20px 44px;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#04160b;text-decoration:none;border-radius:999px;white-space:nowrap;">
<img src="https://www.harbourly.gg/Images/Waitlist/Discord_CTA_cropped.png" width="26" height="20" alt="Discord" border="0" style="display:inline-block;vertical-align:middle;margin-right:12px;width:26px;height:20px;" />
<span style="vertical-align:middle;">Join our Discord</span>
</a>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

</table>
</td>
</tr>

<!-- soft drop shadow cast beneath the panel, gradient-based (not box-shadow) so it actually renders -->
<tr>
<td height="22" style="height:22px;line-height:22px;font-size:0;background:radial-gradient(ellipse 55% 100% at center top,rgba(0,0,0,0.4) 0%,transparent 75%);">&nbsp;</td>
</tr>
</table>

<!-- legal / extra text, outside and below the panel -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
<tr>
<td align="center" style="padding:28px 12px 0 12px;">
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;letter-spacing:0.5px;color:#4b5a72;">Harbourly &middot; A place for gamers who want to grow and coaches who want to teach.</p>
<p style="margin:8px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;letter-spacing:0.5px;color:#4b5a72;">You received this because you signed up at harbourly.gg</p>
<p style="margin:8px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;letter-spacing:0.5px;color:#4b5a72;">&copy; 2026 Harbourly. All Rights Reserved.</p>
</td>
</tr>
</table>

</td>
</tr>
</table>
</body>
</html>
  `.trim();
}
