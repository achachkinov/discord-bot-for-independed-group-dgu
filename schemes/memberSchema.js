const mongoose = require("mongoose")

const memberSchema = new mongoose.Schema({
    memberId: { type: String, required: true },
    guildId: { type: String, required: true },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
})



module.exports = { memberSchema }