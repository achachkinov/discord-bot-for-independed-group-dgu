const { EmbedBuilder } = require("discord.js")

async function announcementDeleteMessageInLog( message, client ) {
    let embed = new EmbedBuilder()
		.setTitle('Было удалено сообщение!')
		.setColor(0xFF0000)
		.addFields(
			{ name: 'Удалённое сообщение: ', value: `${message.content}`},
			{ name: "Автор: ", value:`${message.author.tag} (${message.author})`, inline: true  },
			{ name: "Канал: ", value: `${message.channel}`, inline: true },
		)
		.setFooter({ text: ' - ', iconURL: `${message.author.avatarURL()}` })
		.setTimestamp(message.createdAt);
	let deletedMessageLogDataBase = await global.ChatId.findOne( { guildId: message.guild.id , chatType: "deleteMessageLog" } )
	try {
		let deletedMessageLogId = deletedMessageLogDataBase.chatId
		await client.channels.cache.get( deletedMessageLogId ).send({ embeds: [embed] });
	} catch ( e ) {
		console.log( e )
	}
}

module.exports = { announcementDeleteMessageInLog }