const mongoose = require("mongoose")

const guildSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
})


module.exports = { guildSchema }