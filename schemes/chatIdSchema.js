const mongoose = require("mongoose")

const chatIdSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    chatName: { type: String, required: true },
    chatId: { type: String, required: true }
})


module.exports = { chatIdSchema }