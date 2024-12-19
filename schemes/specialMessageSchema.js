const mongoose = require("mongoose")

const specialMessageSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    specialMessageName: { type: String, required: true },
    specialMessageId: { type: String, required: true }
})


module.exports = { specialMessageSchema }