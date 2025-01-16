async function isBotChat( interaction ) {
    let chatDataBase = await global.ChatId.findOne( { guildId: interaction.guild.id, chatId: interaction.channel.id } )
    if (chatDataBase) {
        return (chatDataBase.chatType == "botChat") 
    }
}

module.exports = { isBotChat }