const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { CalculatorLevelOfMember } = require("../../scripts/other/calculatorLevelOfMember")
const { isBotChat } = require("../../scripts/simpleFunctions/isBotChat")


module.exports = {
	data: new SlashCommandBuilder()
		.setName('statistic')
		.setDescription('Provides information about the user.')
		.addUserOption(option =>
            option.setName('target')
            .setDescription('The member to ban')),
	async execute(interaction) {
		if (isBotChat(interaction)) {
			let guildId = interaction.guild.id
			let target = interaction.options.getMember('target') ?? interaction.member
			let memberDataBase = await global.Member.findOne({ "memberId": target.id, "guildId": guildId })
			let level = memberDataBase.level
			let points = memberDataBase.points
			let pointsOnLevel = CalculatorLevelOfMember.getPointOnLevel(points)
			let pointsForCompleteLevel = CalculatorLevelOfMember.getPointsToNextLevel(points)
			let nickname = target.user.globalName ?? target.user.username
			let progressBar = getProgressBar(pointsOnLevel, pointsOnLevel + pointsForCompleteLevel)
			let embed = new EmbedBuilder()
				.setTitle(`LEVEL: ${level}`)
				.setAuthor({ name: `${nickname}`, iconURL: `${target.user.displayAvatarURL() ?? interaction.user.defaultAvatarURL}` })
				.setColor(target.displayHexColor)
				.addFields(
					{ name: 'points: ', value: `${points}` },
					{ name: "progress:", value: progressBar },
					{ name: "points on level: ", value: `${pointsOnLevel}`, inline: true },
					{ name: "points for complete level: ", value: `${pointsForCompleteLevel}`, inline: true },
				)
				.setFooter({ text: ' not bad, nod bad ' })
				.setTimestamp(interaction.createdAt);
			await interaction.reply({ embeds: [embed] });
		}
	},
};


function getProgressBar( pointsOnLevel, pointsForCompleteLevel ) {
	let progressBarSize = 10
	let progressBarArray = new Array( progressBarSize )
	progressBarArray.fill("⬛️")
	let progressBarFillLevel = Math.floor((pointsOnLevel/pointsForCompleteLevel) * progressBarSize)
	for ( let i = 0; i < progressBarFillLevel; i++ ) {
		progressBarArray[ i ] = "🟦"
	}
	let progressBar = progressBarArray.join("")
	return progressBar
}	