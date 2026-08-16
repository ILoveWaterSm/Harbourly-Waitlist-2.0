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
          html: buildEmailHtml(name, role, country)
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

function buildEmailHtml(name, role, country) {
  const roleLabel = role === 'coach' ? 'Coach' : 'Gamer';
  const countryLine =
    country && country !== 'Not specified'
      ? ` from <strong style="color:#22d66f;">${escapeHtml(country)}</strong>`
      : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the Harbourly waitlist</title>
</head>
<body style="margin:0;padding:0;background:#030b17;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#030b17;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;">
          <tr>
            <td style="background:rgba(15,29,55,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
              <div style="height:3px;background:linear-gradient(90deg,transparent,#22d66f,transparent);"></div>
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 40px 36px;">
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <img src="https://www.harbourly.gg/Images/logo&word-mark.png" alt="Harbourly" width="200" style="display:block;height:auto;" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:rgba(148,163,184,0.9);text-align:center;">
                      Thanks for joining the Harbourly waitlist as a <strong style="color:#22d66f;">${escapeHtml(roleLabel)}</strong>${countryLine}. We're building Southeast Asia's first verified esports coaching marketplace, and you're one of the first to know.
                    </p>
                    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(148,163,184,0.9);text-align:center;">
                      We'll send you an exclusive early access invite the moment we launch. Keep an eye on your inbox.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:28px;">
                    <div style="height:1px;background:rgba(255,255,255,0.07);"></div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <a href="https://harbourly.gg/#how" style="display:inline-block;background:#22d66f;color:#030b17;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:12px;">
                      Learn More About Harbourly
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 6px;font-size:12px;color:rgba(148,163,184,0.4);">
                © 2026 Harbourly &middot; A safe harbour for gamers who want to grow and coaches who want to teach.
              </p>
              <p style="margin:0;font-size:12px;color:rgba(148,163,184,0.3);">
                You received this because you signed up at harbourly.gg
              </p>
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

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
