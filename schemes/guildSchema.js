const mongoose = require("mongoose")
const { memberSchema } = require("./memberSchema")
const { chatIdSchema } = require("./chatIdSchema")
const { roleIdSchema } = require("./roleIdSchema")

const guildSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    rolesId: [ roleIdSchema ],
    members: [ memberSchema ],
    chatsId: [ chatIdSchema ],
})


module.exports = { guildSchema }