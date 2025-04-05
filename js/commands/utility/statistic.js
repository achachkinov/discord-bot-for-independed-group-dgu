const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const { CalculatorLevelOfMember } = require("../../scripts/other/calculatorLevelOfMember")
const { isBotChat } = require("../../scripts/simpleFunctions/isBotChat")
const commandLib = require('../../scripts/other/commandLib')
const listOfStatisticAchivment = require('../../configurations/listOfStatisticAchivment.json')


const data = new SlashCommandBuilder().setName('statistic').setDescription('Provides information about the user.')

module.exports = {
	data: data,
	execute: execute
};

const options = [
	{
		label: '📊личная статистика',
		value: 'getAccessToCategories',
		handlerOfOption: getOwnStatitic
	},
	{
		label: '📊👀статистика конкретного пользователя',
		value: 'deleteAccessToCategories',
		handlerOfOption: getMemberStatistic
	},
	{
		label: '🏆️топ',
		value: 'changeNickname',
		handlerOfOption: getTop
	},
]

async function execute( interaction ) {
	if ( await isCanUseACommand(interaction) ) {
		const content = 'чего желаете'
		try {
			commandLib.createMainMenuMessage( content, options, interaction )
		} catch (e) {
			console.log( e )
		}
	} else {
		defaultReply( interaction )
	}
}

async function isCanUseACommand( interaction ) {
	return await isBotChat( interaction )
}
function defaultReply( interaction ) {
	const content = "здесь нельзя пользоваться данной командой"
	const messageArguments = commandLib.getEphemeralMessageArguments( content )
	interaction.reply( messageArguments )
}

async function getOwnStatitic( interaction ) {
	await memberStatisticReply( interaction.member.id, interaction )
}



async function getMemberStatistic( interaction ) {
	const memberValues = await getSelectedMember( interaction )
	await memberStatisticReply( memberValues.value, memberValues.interaction )
}

async function getSelectedMember( interaction ) {
	const content = 'выберите пользователя'
	const channelSelectMenu = commandLib.getMemberSelectMenu( content )
	const row = new ActionRowBuilder().addComponents( channelSelectMenu );
	const arguments = commandLib.getEphemeralMessageArguments( content, row )
	const confirmation = await commandLib.sendMessageAndGetConfirmation( arguments, interaction )
	return { interaction: confirmation, value: confirmation.values[0] }
}

async function memberStatisticReply( memberId, interaction ) {
	const guild = await global.client.guilds.fetch( interaction.guildId );
	const member = await guild.members.fetch( memberId )
	if ( member.user.bot ) {
		selectedBotReply( interaction )
	} else {
		let pageOfMedals = 0
		let lastInteraction = interaction
		while ( true ) {
			let pageOfMedalsValue = await getSelctedPageOfMedals( member, guild, pageOfMedals, lastInteraction )
			if ( pageOfMedalsValue == "right" ) {
				pageOfMedals +=1
			} else if ( pageOfMedalsValue == "left" ) {
				pageOfMedals -=1
			}
			lastInteraction = pageOfMedalsValue.interaction
		}
	}
}

function selectedBotReply( interaction ) {
	const content = "у ботов нет статистики"
	const messageArguments = commandLib.getEphemeralMessageArguments( content )
	interaction.reply( messageArguments )
}

async function getSelctedPageOfMedals( member, guild, pageOfMedals, interaction ) {
	const content = ''
	const levelEmbed = await getLevelEmbed( member, guild, interaction )
	const medalsEmbed = await getMedalsEmbed( member, guild, pageOfMedals, interaction  )
	const row = await getTurnPageButton()
	const arguments = commandLib.getEphemeralMessageArguments( content, row )
	arguments.embeds = [ levelEmbed, medalsEmbed ]
	const confirmation = await commandLib.sendMessageAndGetConfirmation( arguments, interaction )
	return { interaction: confirmation, value: confirmation.customId }
}

async function getLevelEmbed( member, guild, interaction ) {
	let memberDataBase = await global.Member.findOne({ memberId: member.id, guildId: guild.id })
	let level = memberDataBase.level
	let points = memberDataBase.points
	let pointsOnLevel = CalculatorLevelOfMember.getPointOnLevel(points)
	let pointsForCompleteLevel = CalculatorLevelOfMember.getPointsToNextLevel(points)
	let progressBar = getProgressBar(pointsOnLevel, pointsOnLevel + pointsForCompleteLevel)
	let embed = new EmbedBuilder()
		.setTitle(`LEVEL: ${level}`)
		.setAuthor({ name: `${memberDataBase.nickname}`, iconURL: `${member.user.displayAvatarURL() ?? interaction.user.defaultAvatarURL}` })
		.setColor(member.displayHexColor)
		.addFields(
			{ name: 'points: ', value: `${points}` },
			{ name: "progress:", value: progressBar },
			{ name: "points on level: ", value: `${pointsOnLevel}`, inline: true },
			{ name: "points for complete level: ", value: `${pointsForCompleteLevel}`, inline: true },
		)
	return embed
}

async function getMedalsEmbed( member, guild, pageOfMedals, interaction ) {
	const fields = await getFieldsOfMedals( member, pageOfMedals, interaction )
	const embed = new EmbedBuilder()
		.setColor(member.displayHexColor)
		.setDescription('medals:')
	if ( fields.length == 0 ) {
		embed.addFields( { name: "no medals", value: "user dont have medals"} )
	} else {
		embed.setFields( fields )
	}
	embed.setTimestamp(interaction.createdAt);
	return embed
}

async function getFieldsOfMedals( member, pageOfMedals, interaction ) {
	const fieldsOfMedals = []
	const medalsOnPage = 10
	const listOfMedals = await global.Medal.find( { guildId: interaction.guildId, memberId: member.id, isHave: true } ).sort({ medalPoints: -1 })
	const startMedalIndex = pageOfMedals*medalsOnPage
	const endMedalIndex = (listOfMedals.length - startMedalIndex) < medalsOnPage ? listOfMedals.length : medalsOnPage
	for( let numberMedal = startMedalIndex; numberMedal < endMedalIndex; numberMedal++ ) {
		const medalData = listOfMedals[ numberMedal ]
		const field = getFieldOfMedal( medalData, numberMedal )
		fieldsOfMedals.push( field )
	}
	return fieldsOfMedals
}

function getFieldOfMedal( medalData, numberMedal ) {
	const medal = listOfStatisticAchivment[ medalData.medalStatisticName ][ medalData.medalName ]
	const field = { name: `${numberMedal}. ${medal.emblem} ┃ ${medal.name}`, value: `points: ${ medal.points},  descr: ${ medal.description }` }
	return field
}



async function getTop( interaction ) {
	let pageOfMembers = 0
	let lastInteraction = interaction
	while ( true ) {
		let pageOfMedalsValue = await getSelctedPageOfMembers( pageOfMembers, lastInteraction )
		if ( pageOfMedalsValue.value == "right" ) {
			pageOfMembers +=1
		} else if ( pageOfMedalsValue.value == "left" ) {
			pageOfMembers -=1
		}
		lastInteraction = pageOfMedalsValue.interaction
	}

}

async function getSelctedPageOfMembers( pageOfMembers, interaction ) {
	const content = ''
	const membersEmbed = await getMembersTopEmbed( pageOfMembers, interaction  )
	const row = await getTurnPageButton()
	const arguments = commandLib.getEphemeralMessageArguments( content, row )
	arguments.embeds = [ membersEmbed ]
	const confirmation = await commandLib.sendMessageAndGetConfirmation( arguments, interaction )
	return { interaction: confirmation, value: confirmation.customId }
}

async function getMembersTopEmbed( pageOfMembers, interaction  ) {
	const fields = await getFieldsOfMembers( pageOfMembers, interaction )
	const embed = new EmbedBuilder()
		.setColor( "#e6d450" )
		.setTitle(`TOP OF MEMBERS:`)
		.setFields( fields )
		.setTimestamp(interaction.createdAt);
	return embed
}

async function getFieldsOfMembers( pageOfMembers, interaction ) {
	const guild = await global.client.guilds.fetch( interaction.guildId );
	const fieldsOfMembers = []
	const membersOnPage = 10
	const listOfMembers = await global.Member.find( { guildId: interaction.guildId } ).sort({ points: -1 })
	const startMemberIndex = (pageOfMembers*membersOnPage) % ( membersOnPage*( Math.ceil( listOfMembers.length/membersOnPage) ) )
	const endMemberIndex = (listOfMembers.length - startMemberIndex ) < membersOnPage ? listOfMembers.length : membersOnPage
	for( let numberMember = startMemberIndex; numberMember < endMemberIndex; numberMember++ ) {
		const memberDataBase = listOfMembers[ numberMember ]
		const field = await getFieldOfMember( memberDataBase, numberMember, guild )
		fieldsOfMembers.push( field )
	}
	return fieldsOfMembers
}

async function getFieldOfMember( memberDataBase, numberMember, guild ) {
	const member = await guild.members.fetch( memberDataBase.memberId )
	const field = { name: `${numberMember+1}. ${memberDataBase.nickname}`, value: `level: ${ memberDataBase.level }, points: ${ memberDataBase.points }` }
	return field
}

async function getTurnPageButton() {
	const row = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('left')
			.setLabel('<---')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('right')
			.setLabel('--->')
			.setStyle(ButtonStyle.Primary),
	);
	return row
}

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