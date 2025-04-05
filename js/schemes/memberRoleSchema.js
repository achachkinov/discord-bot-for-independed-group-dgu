const mongoose = require("mongoose")
const { updateMemberRole } = require('../scripts/other/preSaveMemberRoleDataBaseScript')

const memberRoleSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    memberId: { type: String, required: true },
    roleName: { type: String, required: true },
    isHave: { type: Boolean, default: false },
})

memberRoleSchema.pre('save', function (next) {
    updateMemberRole(this)
    next();
})

module.exports = { memberRoleSchema }