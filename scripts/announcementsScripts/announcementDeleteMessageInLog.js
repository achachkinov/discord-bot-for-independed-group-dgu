const { EmbedBuilder } = require("discord.js")

function announcementDeleteMessageInLog( message, client ) {
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
	client.channels.cache.get( deletedMessageLog ).send({ embeds: [embed] }); // айди вашего канала с логами
}

module.exports = { announcementDeleteMessageInLog }