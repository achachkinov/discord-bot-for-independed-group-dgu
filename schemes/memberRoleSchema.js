const mongoose = require("mongoose")

const memberRoleSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    memberId: { type: String, required: true },
    roleName: { type: String, required: true },
    isHave: { type: Boolean, default: false },
})


module.exports = { memberRoleSchema }