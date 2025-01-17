const { EmbedBuilder } = require("discord.js")

async function announcementChangeLevelOfMember( message, client ) {
    let embed = new EmbedBuilder()
        .setTitle('достигнут новый уровень')
        .setColor(0x00AA00)
        .addFields(
            { name: "новый уровень", value:`${message.author.tag} (${message.author})`, inline: true  },
        )
        .setFooter({ text: ' - ', iconURL: `${message.author.avatarURL()}` })
        .setTimestamp(message.createdAt);
    let deletedMessageLogDataBase = await global.ChatId.findOne( { guildId: message.guild.id , chatName: "deleteMessageLog" } )
    let deletedMessageLogId = deletedMessageLogDataBase.chatId
    client.channels.cache.get( deletedMessageLogId ).send({ embeds: [embed] });
}

module.exports = { announcementChangeLevelOfMember }