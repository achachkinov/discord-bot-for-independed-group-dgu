const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { GuildsReatingOfMembers } = require("../../memberRating.js")


//todd: add medals




let singleton = GuildsReatingOfMembers.getSingleton()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('statistic')
		.setDescription('Provides information about the user.')
		.addUserOption(option =>
            option.setName('target')
            .setDescription('The member to ban')),
	async execute(interaction) {
		let guildId = interaction.guild.id
        let target = interaction.options.getMember('target') ?? interaction.member
		let memberReating = singleton.getMemberReating( guildId, target.id )
		let embed = createEmbedStatisticOfMember( memberReating, target )
		await interaction.reply({ embeds: [embed] });
	},
};

function createEmbedStatisticOfMember( memberReating, target ) {
	let level = memberReating.getLevel()
	let pointsOnLevel = memberReating.getPointsOnLevel()
	let pointsForCompleteLevel = memberReating.getPointsForCompleteLevel()
	let points = memberReating.getPoints()
	let nickname = target.user.globalName ?? target.user.username
	let progressBarLength = 10
	let progressBar = getProgressBar( pointsOnLevel, pointsForCompleteLevel, progressBarLength )
	let embed = new EmbedBuilder()
	.setTitle(`LEVEL: ${ level }`)
	.setAuthor({ name: `${ nickname }`, iconURL: `${ target.user.displayAvatarURL() ?? interaction.user.defaultAvatarURL }`})
	.setColor( target.displayHexColor )
	.addFields(
		{ name: 'points: ', value: `${points}`},
		{ name: "progress:", value: progressBar },
		{ name: "points on level: ", value:`${pointsOnLevel}`, inline: true  },
		{ name: "points for complete level: ", value: `${pointsForCompleteLevel}`, inline: true },
	)
	.setFooter({ text: ' not bad, nod bad ' })
	.setTimestamp(interaction.createdAt);
	return embed
}


function getProgressBar( pointsOnLevel, pointsForCompleteLevel, progressBarLength ) {
	let progressBarArray = new Array( progressBarLength )
	progressBarArray.fill("⬛️")
	let progressBarFillLevel = Math.floor((pointsOnLevel/pointsForCompleteLevel) * progressBarLength)
	for ( let i = 0; i < progressBarFillLevel; i++ ) {
		progressBarArray[ i ] = "🟦"
	}
	let progressBar = progressBarArray.join("")
	return progressBar
}	