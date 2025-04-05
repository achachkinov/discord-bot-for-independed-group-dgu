const mongoose = require("mongoose")

const medalSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    memberId: { type: String, required: true },
    medalName: { type: String, required: true },
    isHave: { type: Boolean, default: false },
    medalPoints: { type: Number, required: true },
    medalStatisticName: { type: String, required: true },
    medalType: { type: String, default: 'none' },
    medalTypeData: { type: String, default: 'none' },
})

module.exports = { medalSchema }