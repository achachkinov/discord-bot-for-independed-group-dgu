const mongoose = require("mongoose")


const statistcObj = {
    amountOfCreatedMessage: { type: Number, default: 0 },
    amountOfCreatedMessageInProger: { type: Number, default: 0 },
    amountOfCreatedMessageInMath: { type: Number, default: 0 },
    amountOfCreatedMessageInEntertainment: { type: Number, default: 0 }
    
}


const memberSchema = new mongoose.Schema({
    memberId: { type: String, required: true },
    guildId: { type: String, required: true },
    roles: mongoose.Schema.Types.Mixed,
    points: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    statistic: statistcObj
})



module.exports = { memberSchema }