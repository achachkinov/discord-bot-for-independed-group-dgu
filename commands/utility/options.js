const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { isBotChat } = require("../../scripts/simpleFunctions/isBotChat")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRow, StringSelectMenuBuilder, MessageFlags } = require('discord.js');
const commandLib = require('../../scripts/other/commandLib')

const options = [
	{
		label: '🔑доступ к категориям',
		value: 'accessToCategories',
		handlerOfOption: accessToCategories
	},
	{
		label: '🚩изменить ник',
		value: 'changeNickname',
		handlerOfOption: changeNickname
	},
]

const data = new SlashCommandBuilder().setName('options').setDescription('options of profile on server')

module.exports = {
	data: data,
	execute : execute
};

async function execute( interaction ) {
    if ( await isCanUseACommand(interaction) ) {
		const content = 'чего желаете'
        commandLib.createMainMenuMessage( content, options, interaction )
    } else {
        defaultReply( interaction )
    }
}

async function isCanUseACommand( interaction ) {
    return await isBotChat( interaction )
}
function defaultReply( interaction ) {
    const content = "здесь нельзя пользоваться данной командой"
    const messageArguments = commandLib.getMessageArguments( content )
    interaction.reply( messageArguments )
}

function accessToCategories( interaction ) {
	const content = ""
	//const roles = 
}

function changeNickname( interaction ) {

}

function levelVisible( interaction ) {

}