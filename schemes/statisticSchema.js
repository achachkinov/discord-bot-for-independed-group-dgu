const mongoose = require("mongoose")
const { updateMemberStatistic } = require('../scripts/other/preSaveStatisticDataBaseScript')

const statisticMemberSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    memberId: { type: String, required: true },
    statisticName: { type: String, required: true },
    value: { type: Number, default: 0 },
})

statisticMemberSchema.pre('save', function (next) {
    updateMemberStatistic(this)
    next();
});

module.exports = { statisticMemberSchema }