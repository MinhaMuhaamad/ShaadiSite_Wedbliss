const Invitation = require('../models/Invitation');
const User = require('../models/User');

// Create and send invitation
exports.createInvitation = async (req, res) => {
  try {
    const { guestEmail, guestName, weddingId, message } = req.body;

    const invitation = new Invitation({
      weddingId,
      guestEmail,
      guestName,
      message,
      invitedBy: req.user.id,
      status: 'pending',
      sentDate: new Date()
    });

    await invitation.save();

    // TODO: Send email to guest with invitation link
    sendInvitationEmail(guestEmail, guestName, invitation._id);

    res.status(201).json({ message: 'Invitation sent', invitation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get invitations for a wedding
exports.getInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({ weddingId: req.params.weddingId })
      .sort({ sentDate: -1 });

    const summary = {
      total: invitations.length,
      pending: invitations.filter(i => i.status === 'pending').length,
      accepted: invitations.filter(i => i.status === 'accepted').length,
      declined: invitations.filter(i => i.status === 'declined').length,
      viewed: invitations.filter(i => i.viewedDate).length
    };

    res.json({ invitations, summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single invitation
exports.getInvitation = async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    // Mark as viewed
    if (!invitation.viewedDate) {
      invitation.viewedDate = new Date();
      await invitation.save();
    }

    res.json(invitation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update RSVP
exports.updateRsvp = async (req, res) => {
  try {
    const { rsvpStatus, numberOfGuests, dietaryRestrictions, specialRequests } = req.body;
    const invitation = await Invitation.findByIdAndUpdate(
      req.params.id,
      {
        status: rsvpStatus,
        numberOfGuests,
        dietaryRestrictions,
        specialRequests,
        respondedDate: new Date()
      },
      { new: true }
    );

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    res.json({ message: 'RSVP recorded', invitation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send reminder
exports.sendReminder = async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    // TODO: Send reminder email
    sendReminderEmail(invitation.guestEmail, invitation.guestName, invitation._id);

    invitation.reminderSentDate = new Date();
    invitation.reminderCount = (invitation.reminderCount || 0) + 1;
    await invitation.save();

    res.json({ message: 'Reminder sent', invitation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send bulk invitations
exports.sendBulkInvitations = async (req, res) => {
  try {
    const { guestEmails, weddingId, message } = req.body;

    const invitations = await Promise.all(
      guestEmails.map(email => {
        const invitation = new Invitation({
          weddingId,
          guestEmail: email.email,
          guestName: email.name,
          message,
          invitedBy: req.user.id,
          status: 'pending',
          sentDate: new Date()
        });
        return invitation.save();
      })
    );

    // TODO: Send emails in batch
    guestEmails.forEach(email => {
      sendInvitationEmail(email.email, email.name, null);
    });

    res.status(201).json({ message: 'Invitations sent', count: invitations.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get invitation statistics
exports.getInvitationStats = async (req, res) => {
  try {
    const invitations = await Invitation.find({ weddingId: req.params.weddingId });

    const stats = {
      totalSent: invitations.length,
      totalViewed: invitations.filter(i => i.viewedDate).length,
      totalResponded: invitations.filter(i => i.respondedDate).length,
      accepted: invitations.filter(i => i.status === 'accepted').length,
      declined: invitations.filter(i => i.status === 'declined').length,
      pending: invitations.filter(i => i.status === 'pending').length,
      totalGuests: invitations.reduce((sum, i) => sum + (i.numberOfGuests || 1), 0),
      viewRate: invitations.length > 0 ? Math.round((invitations.filter(i => i.viewedDate).length / invitations.length) * 100) : 0,
      responseRate: invitations.length > 0 ? Math.round((invitations.filter(i => i.respondedDate).length / invitations.length) * 100) : 0,
      acceptanceRate: invitations.filter(i => i.status === 'accepted').length > 0
        ? Math.round((invitations.filter(i => i.status === 'accepted').length / invitations.length) * 100)
        : 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function - placeholder for email sending
function sendInvitationEmail(email, name, invitationId) {
  console.log(`[v0] Sending invitation email to ${email} for invitation ${invitationId}`);
  // TODO: Implement actual email sending with nodemailer or SendGrid
}

function sendReminderEmail(email, name, invitationId) {
  console.log(`[v0] Sending reminder email to ${email} for invitation ${invitationId}`);
  // TODO: Implement actual email sending with nodemailer or SendGrid
}
