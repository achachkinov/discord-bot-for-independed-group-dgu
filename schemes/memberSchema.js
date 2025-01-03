const mongoose = require("mongoose")
const { updateDisplayAndDataBase } = require("../scripts/other/preSaveMemberDataBaseScript")

const memberSchema = new mongoose.Schema({
    memberId: { type: String, required: true },
    guildId: { type: String, required: true },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
})

memberSchema.pre('save', function (next) {
    updateDisplayAndDataBase(this)
    next();
});

module.exports = { memberSchema }