const mongoose = require("mongoose")
const { memberSchema } = require("./memberSchema")

const guildSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    rolesId: mongoose.Schema.Types.Mixed,
    members: [ memberSchema ],
    chatDiscordId: mongoose.Schema.Types.Mixed,
})


module.exports = { guildSchema }