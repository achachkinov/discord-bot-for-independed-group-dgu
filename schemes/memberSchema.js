const mongoose = require("mongoose")
const { statisticSchema } = require("./statisticSchema")


const memberSchema = new mongoose.Schema({
    memberId: { type: String, required: true },
    guildId: { type: String, required: true },
    roles: [ String ],
    points: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    statistic: [ statisticSchema ]
})



module.exports = { memberSchema }