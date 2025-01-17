const listOfChannelTypes = require('../../configurations/listOfChannelTypes.json')

async function getPointsForMessage( message ) {
    const channelId = message.channel.id
    const chatIdDataBase = await global.ChatId.findOne( { chatId : channelId, guildId: message.guild.id } )
    const points = listOfChannelTypes[ chatIdDataBase.chatType ].pointsForCreateMessage
    return points
}



module.exports = { getPointsForMessage }