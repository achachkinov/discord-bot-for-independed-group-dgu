const mongoose = require("mongoose")
const { guildSchema } = require("../../schemes/guildSchema")
const { memberSchema } = require("../../schemes/memberSchema")
const { chatIdSchema } = require("../../schemes/chatIdSchema")
const { roleIdSchema } = require("../../schemes/roleIdSchema")
const { statisticSchema } = require("../../schemes/statisticSchema")
const { specialMessageSchema } = require("../../schemes/specialMessageSchema")
const { memberRoleSchema } = require("../../schemes/memberRoleSchema")

const { updateDisplayAndDataBase } = require('../../scripts/other/preSaveMemberDataBaseScript')
const { updateMemberStatistic } = require('../../scripts/other/preSaveStatisticDataBaseScript')
const { updateMemberRole } = require('../../scripts/other/preSaveMemberRoleDataBaseScript')


function initAllModels() {
    memberSchema.pre('save', function (next) {
        updateDisplayAndDataBase(this)
        next();
    });

    statisticSchema.pre('save', function (next) {
        updateMemberStatistic(this)
        next();
    });

    memberRoleSchema.pre('save', function (next) {
        updateMemberRole(this)
        next();
    })


    const Guild = mongoose.model('Guild', guildSchema);
    const Member = mongoose.model('Member', memberSchema);
    const ChatId = mongoose.model('ChatId', chatIdSchema)
    const RoleId = mongoose.model('RoleId', roleIdSchema)
    const StatisticMember = mongoose.model('StatisticMember', statisticSchema)
    const SpecialMessage = mongoose.model('SpecialMessage', specialMessageSchema)
    const MemberRole = mongoose.model('memberRole', memberRoleSchema)

    global.Guild = Guild
    global.Member = Member
    global.ChatId = ChatId
    global.RoleId = RoleId
    global.StatisticMember = StatisticMember
    global.SpecialMessage = SpecialMessage
    global.MemberRole = MemberRole
}

module.exports = { initAllModels }