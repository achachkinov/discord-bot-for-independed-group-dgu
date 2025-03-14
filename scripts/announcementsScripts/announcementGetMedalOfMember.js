const { EmbedBuilder } = require("discord.js")

function announcementGetMedalOfMember() {
    // const guild = await global.client.guilds.fetch( memberDataBase.guildId );
	// const member = await guild.members.fetch( memberDataBase.memberId )
	// const pointsForCompleteLevel = CalculatorLevelOfMember.getPointsToNextLevel(points)
    // let embed = new EmbedBuilder()
    //     .setTitle(`получена медаль: ${level}`)
    //     .setAuthor({ name: `${memberDataBase.nickname}`, iconURL: `${member.user.displayAvatarURL() ?? guild.displayAvatarURL()}` })
    //     .setColor(`#00A550`)
    //     .addFields(
    //         { name: 'новый уровень', value: `${ memberDataBase.level }`},
	// 		{ name: "поинтс:", value:`${message.author.tag} (${memberDataBase.points})`, inline: true  },
	// 		{ name: "поинтс до некст левел: ", value: `${pointsForCompleteLevel}`, inline: true },
    //     )
    //     .setTimestamp(message.createdAt);
    // let deletedMessageLogDataBase = await global.ChatId.findOne( { guildId: message.guild.id , chatName: "botChat" } )
    // let deletedMessageLogId = deletedMessageLogDataBase.chatId
    // client.channels.cache.get( deletedMessageLogId ).send({ embeds: [embed] });
}

module.exports = { announcementGetMedalOfMember }