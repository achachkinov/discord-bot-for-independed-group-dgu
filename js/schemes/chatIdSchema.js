const mongoose = require("mongoose")

const chatIdSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    chatId: { type: String, required: true },
    chatType: { type: String, required: true, default: "none" }
})


module.exports = { chatIdSchema }