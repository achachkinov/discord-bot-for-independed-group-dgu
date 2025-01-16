const { getPointsForMessage } = require("../simpleFunctions/getPointsForMessage")
const { addPointsToMember } = require("../simpleFunctions/addPointsToMember")
const { addValueToStatistic } = require("../simpleFunctions/addValueToStatistic")

async function handleMessageCreate( message, Member ) {
    if (message.author.bot) return;
    console.log( message )
    await addPointsToMemberForCreateMessage( message, Member )
    addValueToStatistic( message, message.channelId, 1, [ "channel", "amountOfCreatedMessage" ] )
    addValueToStatistic( message, message.channel.parentId, 1, [ "category", "amountOfCreatedMessage"] )
}

async function addPointsToMemberForCreateMessage( message ) {
    let points = getPointsForMessage( message )
    addPointsToMember( message, points )
    addValueToStatistic( message, "amountOfCreatedMessage", 1 )
}

//const category = message.channel.parent;
module.exports = { handleMessageCreate }