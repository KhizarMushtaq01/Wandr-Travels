const mongoose = require('mongoose');

const adminAuditLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetType: { type: String, required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: String, default: '' },
}, { timestamps: true });

const AdminAuditLog = mongoose.model('AdminAuditLog', adminAuditLogSchema);

async function logAdminAction(adminId, action, targetType, targetId, details = '') {
  try {
    await AdminAuditLog.create({ admin: adminId, action, targetType, targetId, details });
  } catch (e) {}
}

module.exports = { AdminAuditLog, logAdminAction };
