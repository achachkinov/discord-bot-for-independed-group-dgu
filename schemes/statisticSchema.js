const mongoose = require("mongoose")


const statisticSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    memberId: { type: String, required: true },
    statisticName: { type: String, required: true },
    value: { type: Number, default: 0 },
})


module.exports = { statisticSchema }