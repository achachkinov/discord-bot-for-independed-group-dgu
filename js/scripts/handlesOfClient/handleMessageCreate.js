const { getPointsForMessage } = require("../simpleFunctions/getPointsForMessage")
const { addPointsToMember } = require("../simpleFunctions/addPointsToMember")
const { addValueToStatistic } = require("../simpleFunctions/addValueToStatistic")

async function handleMessageCreate( message, Member ) {
    if (message.author.bot) return;
    await addPointsToMemberForCreateMessage( message, Member )
    await addStatisticValue( message )
}

async function addPointsToMemberForCreateMessage( message ) {
    let points = await getPointsForMessage( message )
    await addPointsToMember( message, points )
}

async function addStatisticValue( message ) {
    await addValueToStatistic( message, "amountOfCreatedMessage", 1 )
    const channelDataBase = await global.ChatId.findOne( { guildId: message.guildId, chatId: message.channel.id } )
    const channelType = channelDataBase.chatType
    if ( channelType == "forum" ) {
        await addValueToStatistic( message, "amountOfCreatedForumMessage", 1 )
    } else if ( channelType == "memes" ) {
        await addValueToStatistic( message, "amountOfCreatedMemes", 1 )
    }
}

//const category = message.channel.parent;
module.exports = { handleMessageCreate }