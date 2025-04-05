const mongoose = require("mongoose")

const roleIdSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    roleName: { type: String, required: true },
    roleId: { type: String, required: true }
})

module.exports = { roleIdSchema }