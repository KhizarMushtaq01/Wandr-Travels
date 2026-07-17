const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const emailStyles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@300;400;500&display=swap');
    body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background: #0f0f0f; }
    .wrapper { max-width: 620px; margin: 0 auto; background: #0f0f0f; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 40px 40px 30px; text-align: center; }
    .logo { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 600; color: #e8c27a; letter-spacing: 3px; }
    .logo span { color: #ffffff; }
    .tagline { color: #8ba3c7; font-size: 12px; letter-spacing: 4px; text-transform: uppercase; margin-top: 4px; }
    .hero-banner { background: linear-gradient(135deg, #e8c27a22, #0f346022); border-bottom: 1px solid #e8c27a33; padding: 30px 40px; text-align: center; }
    .hero-icon { font-size: 48px; margin-bottom: 12px; }
    .hero-title { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; color: #ffffff; margin: 0 0 8px; }
    .body { padding: 32px 40px; color: #c8d6e8; line-height: 1.7; }
    .greeting { font-size: 18px; color: #ffffff; font-weight: 500; margin-bottom: 16px; }
    .message { font-size: 15px; color: #b0c4de; margin-bottom: 24px; }
    .info-card { background: #1a2744; border: 1px solid #2a3f6b; border-radius: 12px; padding: 20px 24px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2a3f6b22; }
    .info-label { color: #6b8ab8; font-size: 13px; }
    .info-value { color: #e0e8f5; font-size: 13px; font-weight: 500; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #e8c27a, #d4a843); color: #0f0f0f; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; letter-spacing: 0.5px; margin: 20px 0; }
    .warning-box { background: #2a1a0a; border-left: 3px solid #e8c27a; padding: 14px 18px; border-radius: 4px; margin: 16px 0; }
    .warning-text { color: #e8c27a; font-size: 13px; }
    .divider { border: none; border-top: 1px solid #2a3f6b; margin: 24px 0; }
    .footer { background: #080808; padding: 24px 40px; text-align: center; }
    .footer-text { color: #4a5a6a; font-size: 12px; line-height: 1.8; }
    .footer-links { margin: 12px 0; }
    .footer-links a { color: #6b8ab8; text-decoration: none; margin: 0 8px; font-size: 12px; }
    .badge { display: inline-block; background: #e8c27a22; border: 1px solid #e8c27a44; color: #e8c27a; font-size: 11px; padding: 3px 10px; border-radius: 20px; margin-left: 8px; vertical-align: middle; }
    .trip-card { background: #1a2744; border-radius: 12px; overflow: hidden; margin: 16px 0; }
    .trip-card-header { background: linear-gradient(135deg, #e8c27a22, #0f346044); padding: 16px 20px; }
    .trip-card-body { padding: 16px 20px; }
    .trip-name { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; color: #e8c27a; }
    .highlight { color: #e8c27a; font-weight: 600; }
  </style>
`;

const sendEmail = async ({ to, subject, html }) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Wandr Travel <noreply@albreeza.com>',
    to,
    subject,
    html,
  });
  if (error) throw new Error(error.message || 'Resend send failed');
  console.log(`📧 Email sent: ${data.id} → ${to}`);
  return data;
};
exports.sendEmail = sendEmail;

const wrapEmail = (content) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Wandr</title>${emailStyles}</head>
<body>
<div class="wrapper">
  <div class="header">
    <div class="logo">WAND<span>R</span></div>
    <div class="tagline">All-In-One Adventure Planner</div>
  </div>
  ${content}
  <div class="footer">
    <div class="footer-text">
      © ${new Date().getFullYear()} Wandr Travel. All rights reserved.<br>
      Your premium adventure companion for every journey.
    </div>
    <div class="footer-links">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Support</a>
      <a href="#">Unsubscribe</a>
    </div>
  </div>
</div>
</body>
</html>`;

// ─── Email Templates ───────────────────────────────────────────────────────────

exports.sendWelcomeEmail = async (user) => {
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">🌍</div>
      <div class="hero-title">Welcome to Wandr!</div>
    </div>
    <div class="body">
      <div class="greeting">Hey ${user.firstName}, your adventure starts now! 🎉</div>
      <div class="message">
        We're thrilled to have you join our community of passionate travelers. 
        Wandr is your all-in-one adventure planner — plan, book, track, and relive every journey.
      </div>
      <div class="info-card">
        <div style="font-size:13px;color:#6b8ab8;margin-bottom:12px;text-transform:uppercase;letter-spacing:2px;">What you can do with Wandr</div>
        <div style="color:#c8d6e8;font-size:14px;line-height:2;">
          ✈️ Plan detailed day-by-day itineraries<br>
          🏨 Manage all your bookings in one place<br>
          💰 Track travel budgets & expenses<br>
          🎒 Create & share packing lists<br>
          🗺️ Discover routes from fellow adventurers<br>
          📸 Journal your adventures with photos
        </div>
      </div>
      <div style="text-align:center;">
        <a href="${process.env.CLIENT_URL}/dashboard" class="cta-btn">Start Planning Your Adventure</a>
      </div>
    </div>
  `);
  return sendEmail({ to: user.email, subject: '🌍 Welcome to Wandr — Your Adventure Begins!', html });
};

exports.sendSignInEmail = async (user, { ip, device, time }) => {
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">🔐</div>
      <div class="hero-title">New Sign-In Detected</div>
    </div>
    <div class="body">
      <div class="greeting">Hi ${user.firstName},</div>
      <div class="message">We noticed a new sign-in to your Wandr account. Here are the details:</div>
      <div class="info-card">
        <div class="info-row"><span class="info-label">Time</span><span class="info-value">${time}</span></div>
        <div class="info-row"><span class="info-label">IP Address</span><span class="info-value">${ip || 'Unknown'}</span></div>
        <div class="info-row"><span class="info-label">Device</span><span class="info-value">${device || 'Unknown'}</span></div>
      </div>
      <div class="warning-box">
        <div class="warning-text">⚠️ If this wasn't you, please change your password immediately and contact our support team.</div>
      </div>
      <div style="text-align:center;">
        <a href="${process.env.CLIENT_URL}/settings/security" class="cta-btn">Secure My Account</a>
      </div>
    </div>
  `);
  return sendEmail({ to: user.email, subject: '🔐 New Sign-In to Your Wandr Account', html });
};

exports.sendPasswordChangedEmail = async (user) => {
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">🔑</div>
      <div class="hero-title">Password Changed</div>
    </div>
    <div class="body">
      <div class="greeting">Hi ${user.firstName},</div>
      <div class="message">Your Wandr account password was successfully changed on <span class="highlight">${new Date().toLocaleString()}</span>.</div>
      <div class="warning-box">
        <div class="warning-text">⚠️ If you did not make this change, please contact us immediately at support@wandr.travel or reset your password.</div>
      </div>
      <div style="text-align:center;">
        <a href="${process.env.CLIENT_URL}/settings/security" class="cta-btn">Review Security Settings</a>
      </div>
    </div>
  `);
  return sendEmail({ to: user.email, subject: '🔑 Your Wandr Password Was Changed', html });
};

exports.sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">🔓</div>
      <div class="hero-title">Reset Your Password</div>
    </div>
    <div class="body">
      <div class="greeting">Hi ${user.firstName},</div>
      <div class="message">You requested a password reset for your Wandr account. Click the button below to create a new password. This link expires in <span class="highlight">1 hour</span>.</div>
      <div style="text-align:center;">
        <a href="${resetUrl}" class="cta-btn">Reset My Password</a>
      </div>
      <div class="warning-box">
        <div class="warning-text">⚠️ If you didn't request this, please ignore this email. Your password won't change.</div>
      </div>
      <hr class="divider">
      <div style="font-size:12px;color:#4a5a6a;">If the button doesn't work, copy this link:<br><span style="color:#6b8ab8;word-break:break-all;">${resetUrl}</span></div>
    </div>
  `);
  return sendEmail({ to: user.email, subject: '🔓 Reset Your Wandr Password', html });
};

exports.sendEmailChangedEmail = async (user, oldEmail, newEmail) => {
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">✉️</div>
      <div class="hero-title">Email Address Updated</div>
    </div>
    <div class="body">
      <div class="greeting">Hi ${user.firstName},</div>
      <div class="message">Your Wandr account email address has been updated.</div>
      <div class="info-card">
        <div class="info-row"><span class="info-label">Previous Email</span><span class="info-value">${oldEmail}</span></div>
        <div class="info-row"><span class="info-label">New Email</span><span class="info-value">${newEmail}</span></div>
        <div class="info-row"><span class="info-label">Changed On</span><span class="info-value">${new Date().toLocaleString()}</span></div>
      </div>
      <div class="warning-box">
        <div class="warning-text">⚠️ If you didn't make this change, please contact support@wandr.travel immediately.</div>
      </div>
    </div>
  `);
  // Send to both old and new email
  await sendEmail({ to: oldEmail, subject: '✉️ Your Wandr Email Address Was Changed', html });
  return sendEmail({ to: newEmail, subject: '✉️ Your Wandr Email Address Was Changed', html });
};

exports.sendProfileUpdatedEmail = async (user, changes) => {
  const changeList = Object.entries(changes).map(([k, v]) => 
    `<div class="info-row"><span class="info-label">${k}</span><span class="info-value">${v}</span></div>`
  ).join('');
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">👤</div>
      <div class="hero-title">Profile Updated</div>
    </div>
    <div class="body">
      <div class="greeting">Hi ${user.firstName},</div>
      <div class="message">Your Wandr profile was updated on <span class="highlight">${new Date().toLocaleString()}</span>.</div>
      <div class="info-card">${changeList}</div>
    </div>
  `);
  return sendEmail({ to: user.email, subject: '👤 Your Wandr Profile Has Been Updated', html });
};

exports.sendAvatarChangedEmail = async (user) => {
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">🖼️</div>
      <div class="hero-title">Profile Avatar Updated</div>
    </div>
    <div class="body">
      <div class="greeting">Hi ${user.firstName},</div>
      <div class="message">Your Wandr profile avatar was successfully updated on <span class="highlight">${new Date().toLocaleString()}</span>.</div>
      <div class="warning-box">
        <div class="warning-text">⚠️ If you didn't make this change, please secure your account immediately.</div>
      </div>
      <div style="text-align:center;">
        <a href="${process.env.CLIENT_URL}/profile" class="cta-btn">View My Profile</a>
      </div>
    </div>
  `);
  return sendEmail({ to: user.email, subject: '🖼️ Your Wandr Avatar Was Updated', html });
};

exports.sendTripCreatedEmail = async (user, trip) => {
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">🗺️</div>
      <div class="hero-title">New Trip Created!</div>
    </div>
    <div class="body">
      <div class="greeting">Hi ${user.firstName}, your adventure is taking shape! 🎒</div>
      <div class="trip-card">
        <div class="trip-card-header"><div class="trip-name">${trip.name}</div></div>
        <div class="trip-card-body">
          <div class="info-row"><span class="info-label">Destinations</span><span class="info-value">${(trip.destinations || []).join(', ') || 'TBD'}</span></div>
          <div class="info-row"><span class="info-label">Start Date</span><span class="info-value">${trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'TBD'}</span></div>
          <div class="info-row"><span class="info-label">Duration</span><span class="info-value">${trip.duration || 'TBD'} days</span></div>
          <div class="info-row"><span class="info-label">Status</span><span class="info-value">${trip.status || 'Planning'}</span></div>
        </div>
      </div>
      <div style="text-align:center;">
        <a href="${process.env.CLIENT_URL}/trips/${trip._id}" class="cta-btn">Build My Itinerary</a>
      </div>
    </div>
  `);
  return sendEmail({ to: user.email, subject: `🗺️ Trip Created: ${trip.name}`, html });
};

exports.sendBookingConfirmationEmail = async (user, booking) => {
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">✅</div>
      <div class="hero-title">Booking Confirmed!</div>
    </div>
    <div class="body">
      <div class="greeting">Hi ${user.firstName}, you're all set! 🎉</div>
      <div class="message">Your booking has been confirmed. Here are your details:</div>
      <div class="info-card">
        <div class="info-row"><span class="info-label">Booking ID</span><span class="info-value">#${booking._id?.toString().slice(-8).toUpperCase()}</span></div>
        <div class="info-row"><span class="info-label">Type</span><span class="info-value">${booking.type}</span></div>
        <div class="info-row"><span class="info-label">Name</span><span class="info-value">${booking.name}</span></div>
        <div class="info-row"><span class="info-label">Check-in / Date</span><span class="info-value">${booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Check-out</span><span class="info-value">${booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Total Amount</span><span class="info-value highlight">$${booking.totalAmount || 0}</span></div>
        <div class="info-row"><span class="info-label">Status</span><span class="info-value">✅ Confirmed</span></div>
      </div>
      <div style="text-align:center;">
        <a href="${process.env.CLIENT_URL}/bookings/${booking._id}" class="cta-btn">View Booking Details</a>
      </div>
    </div>
  `);
  return sendEmail({ to: user.email, subject: `✅ Booking Confirmed: ${booking.name}`, html });
};

exports.sendBookingCancelledEmail = async (user, booking) => {
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">❌</div>
      <div class="hero-title">Booking Cancelled</div>
    </div>
    <div class="body">
      <div class="greeting">Hi ${user.firstName},</div>
      <div class="message">Your booking has been cancelled. Here's a summary:</div>
      <div class="info-card">
        <div class="info-row"><span class="info-label">Booking ID</span><span class="info-value">#${booking._id?.toString().slice(-8).toUpperCase()}</span></div>
        <div class="info-row"><span class="info-label">Name</span><span class="info-value">${booking.name}</span></div>
        <div class="info-row"><span class="info-label">Cancelled On</span><span class="info-value">${new Date().toLocaleString()}</span></div>
      </div>
      <div class="warning-box">
        <div class="warning-text">If you didn't cancel this booking or have questions, please contact support@wandr.travel</div>
      </div>
    </div>
  `);
  return sendEmail({ to: user.email, subject: `❌ Booking Cancelled: ${booking.name}`, html });
};

exports.sendTripInviteEmail = async (invitee, inviter, trip) => {
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">✈️</div>
      <div class="hero-title">You've Been Invited!</div>
    </div>
    <div class="body">
      <div class="greeting">Hey ${invitee.firstName || invitee}! 🌟</div>
      <div class="message"><span class="highlight">${inviter.firstName} ${inviter.lastName}</span> has invited you to join their trip on Wandr!</div>
      <div class="trip-card">
        <div class="trip-card-header"><div class="trip-name">${trip.name}</div></div>
        <div class="trip-card-body">
          <div class="info-row"><span class="info-label">Destinations</span><span class="info-value">${(trip.destinations || []).join(', ') || 'Adventure awaits!'}</span></div>
          <div class="info-row"><span class="info-label">Start Date</span><span class="info-value">${trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'TBD'}</span></div>
        </div>
      </div>
      <div style="text-align:center;">
        <a href="${process.env.CLIENT_URL}/trips/invite/${trip._id}" class="cta-btn">Join This Adventure</a>
      </div>
    </div>
  `);
  return sendEmail({ to: invitee.email || invitee, subject: `✈️ ${inviter.firstName} invited you to ${trip.name} on Wandr!`, html });
};

exports.sendAccountDeletedEmail = async (user) => {
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">👋</div>
      <div class="hero-title">Account Deleted</div>
    </div>
    <div class="body">
      <div class="greeting">Hi ${user.firstName},</div>
      <div class="message">Your Wandr account has been permanently deleted as requested on <span class="highlight">${new Date().toLocaleString()}</span>.</div>
      <div class="message">We're sorry to see you go. All your data has been removed from our systems.</div>
      <div class="info-card">
        <div style="color:#c8d6e8;font-size:14px;">If you ever want to come back to your adventures, you're always welcome to create a new account. Safe travels! 🌍</div>
      </div>
    </div>
  `);
  return sendEmail({ to: user.email, subject: '👋 Your Wandr Account Has Been Deleted', html });
};

exports.sendAdminUserAlertEmail = async (adminEmail, message, details) => {
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">🛡️</div>
      <div class="hero-title">Admin Alert</div>
    </div>
    <div class="body">
      <div class="greeting">Admin Notification</div>
      <div class="message">${message}</div>
      <div class="info-card">
        <pre style="color:#c8d6e8;font-size:13px;white-space:pre-wrap;">${JSON.stringify(details, null, 2)}</pre>
      </div>
      <div style="text-align:center;">
        <a href="${process.env.CLIENT_URL}/admin" class="cta-btn">Go to Admin Panel</a>
      </div>
    </div>
  `);
  return sendEmail({ to: adminEmail, subject: '🛡️ Wandr Admin Alert', html });
};

exports.sendContactReceivedEmail = async (contactMsg) => {
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">📬</div>
      <div class="hero-title">We Got Your Message!</div>
    </div>
    <div class="body">
      <div class="greeting">Hi ${contactMsg.name},</div>
      <div class="message">Thanks for reaching out to Wandr Travel. We've received your message and our team will get back to you as soon as possible.</div>
      <div class="info-card">
        <div class="info-row"><span class="info-label">Subject</span><span class="info-value">${contactMsg.subject}</span></div>
        <div class="info-row"><span class="info-label">Submitted</span><span class="info-value">${new Date().toLocaleString()}</span></div>
      </div>
      <div class="message">In the meantime, feel free to keep exploring Wandr and planning your next adventure.</div>
    </div>
  `);
  return exports.sendEmail({ to: contactMsg.email, subject: '📬 We Received Your Message — Wandr Travel', html });
};

exports.sendNewContactMessageAdminEmail = async (adminEmail, contactMsg) => {
  const html = wrapEmail(`
    <div class="hero-banner">
      <div class="hero-icon">✉️</div>
      <div class="hero-title">New Contact Message</div>
    </div>
    <div class="body">
      <div class="greeting">Admin Notification</div>
      <div class="message">A new message was submitted through the Contact form.</div>
      <div class="info-card">
        <div class="info-row"><span class="info-label">From</span><span class="info-value">${contactMsg.name}</span></div>
        <div class="info-row"><span class="info-label">Email</span><span class="info-value">${contactMsg.email}</span></div>
        <div class="info-row"><span class="info-label">Subject</span><span class="info-value">${contactMsg.subject}</span></div>
      </div>
      <div class="info-card">
        <div style="color:#c8d6e8;font-size:14px;white-space:pre-wrap;">${contactMsg.message}</div>
      </div>
      <div style="text-align:center;">
        <a href="${process.env.CLIENT_URL}/admin/contact" class="cta-btn">View in Admin Inbox</a>
      </div>
    </div>
  `);
  return exports.sendEmail({ to: adminEmail, subject: `✉️ New Contact Message: ${contactMsg.subject}`, html });
};
