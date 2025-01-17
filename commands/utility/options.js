const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { isBotChat } = require("../../scripts/simpleFunctions/isBotChat")
const commandLib = require('../../scripts/other/commandLib')
const { getOrCreateFromDataBase } = require('../../scripts/simpleFunctions/getOrCreateFromDataBase')

const options = [
	{
		label: '🔑открыть категорию',
		value: 'getAccessToCategories',
		handlerOfOption: getAccessToCategories
	},
	{
		label: '🔒закрыть категорию',
		value: 'deleteAccessToCategories',
		handlerOfOption: deleteAccessToCategories
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



async function getAccessToCategories( interaction ) {
	const lockedCategoriesList = await getAllLockedCategoriesList( interaction )
	if ( lockedCategoriesList.length > 0 ) {
		const content = "выберите доступ к:"
		const selectedCategories = await getSelectedOption( content, interaction, lockedCategoriesList )
		await getAccessToSelectedCategory( selectedCategories.interaction, selectedCategories.value )
		await accessIsGetReply( selectedCategories.interaction, selectedCategories.value )
	} else {
		await noLockedCategoriesReply( interaction )
	}
}

async function getAllLockedCategoriesList( interaction ) {
	const isNotLocked = false
	const lockerCategoriesList = await getSpecificListOfCategories( interaction, isNotLocked )
	return lockerCategoriesList
}



async function noLockedCategoriesReply( interaction ) {
	const content = "нет закрытых категорий"
	commandLib.sendEphemeralMessage( content, interaction)
}

async function getAccessToSelectedCategory( interaction, roleName ) {
	const memberRoleArguments = { guildId: interaction.guildId, roleName: roleName, memberId: interaction.member.id }
	const memberRoleDataBase = await getOrCreateFromDataBase( global.MemberRole, memberRoleArguments )
	memberRoleDataBase.isHave = true
	memberRoleDataBase.save()
}

async function accessIsGetReply( interaction, roleName) {
	const content = `${ roleName } получен`
    commandLib.sendEphemeralMessage( content, interaction)
}




async function deleteAccessToCategories( interaction ) {
	const lockedCategoriesList = await getAllOpenCategoriesList( interaction )
	if ( lockedCategoriesList.length > 0 ) {
		const content = "выберите отключение доступа от:"
		const selectedCategories = await getSelectedCategoryAccess( content, interaction, lockedCategoriesList )
		await deleteAccessToSelectedCategory( selectedCategories.interaction, selectedCategories.value )
		await accessIsDeleteReply( selectedCategories.interaction, selectedCategories.value )
	} else {
		await noOpenCategoriesReply( interaction )
	}
}

async function noOpenCategoriesReply( interaction ) {
	const content = "нет открытых категорий"
	commandLib.sendEphemeralMessage( content, interaction)
}

async function getAllOpenCategoriesList( interaction ) {
	const isLocked = true
	const lockerCategoriesList = await getSpecificListOfCategories( interaction, isLocked )
	return lockerCategoriesList
}

async function deleteAccessToSelectedCategory( interaction, roleName ) {
	const memberRoleArguments = { guildId: interaction.guildId, roleName: roleName, memberId: interaction.member.id }
	const memberRoleDataBase = await getOrCreateFromDataBase( global.MemberRole, memberRoleArguments )
	memberRoleDataBase.isHave = false
	memberRoleDataBase.save()
}

async function accessIsDeleteReply( interaction, roleName) {
	const content = `${ roleName } удален`
    commandLib.sendEphemeralMessage( content, interaction)
}


async function getSpecificListOfCategories( interaction, isNotLocked ) {
	const lockerCategoriesList = []
	const categoies = await global.CategoryId.find( { guildId: interaction.guildId } )
	for ( const category of categoies ) {
		const roleName = category.accessToCategoryRoleName
		const memberRoleArguments = { guildId: interaction.guildId, roleName: roleName, memberId: interaction.member.id }
		const memberRoleDataBase = await getOrCreateFromDataBase( global.MemberRole, memberRoleArguments )
		if ( memberRoleDataBase.isHave == isNotLocked) {
			lockerCategoriesList.push( { label: roleName, value: roleName } )
		}
	}
	return lockerCategoriesList
}

const optionsOfChangeNickname = [ 
	{
		label: 'сбросить ник',
		value: 'defaultNick', 
	},
	{
		label: 'вписать новый ник',
		value: 'writeNewNick', 
	}
] 

async function changeNickname( interaction ) {
	const content = "чего желаете"
	const selectedTypeOption = await getSelectedOption( content, interaction, optionsOfChangeNickname )
	if ( selectedTypeOption.value == 'defaultNick' ) {
		await setDefaultNickname( interaction )
		await setDefaultNickReply( interaction )
	} else if ( selectedTypeOption.value == 'writeNewNick' ) {
		const newNickname = await getSelectedNickname( selectedTypeOption.interaction )
		console.log( newNickname, "newNickname" )
		await setNickname( newNickname.interaction, newNickname.value )
		await setNewNicknameReply( newNickname.interaction, newNickname.value )
	}
}

async function setDefaultNickname( interaction ) {
	const member = await guild.members.fetch( interaction.member.id )
	const defaultNickName = member.user.globalName ?? member.user.username
	await setNickname( interaction, defaultNickName )
}

async function setDefaultNickReply( interaction ) {
	const content = `ник был сброшен`
    commandLib.sendEphemeralMessage( content, interaction)
}

async function getSelectedNickname( interaction ) {
    const textInput = commandLib.getShortTextInput( 'никнейм' )
    const rowColor = new ActionRowBuilder().addComponents( textInput );
    const allRow = [ rowColor ]
    const modal = commandLib.getModal( allRow, 'введите новый никнейм' )
    const confirmation = await commandLib.sendModalAndGetConfirmation( modal, interaction )
    const value = confirmation.fields.getTextInputValue( 'никнейм' )
    return { interaction : confirmation, value : value }
}

async function setNickname( interaction, nickname ) {
	const memberDataBase = await global.Member.findOne( { guildId: interaction.guildId, memberId: interaction.member.id } )
	memberDataBase.nickname = defaultNickName
	memberDataBase.save()
}

async function setNewNicknameReply( interaction, nickname) {
	const content = `ник: ` + nickname + ' установлен '
    commandLib.sendEphemeralMessage( content, interaction)
}


async function getSelectedOption( content, interaction, options ) {
    const optionSelectMenu = commandLib.getStringSelectMenu( options )
    const row = new ActionRowBuilder().addComponents( optionSelectMenu );
    const arguments = commandLib.getEphemeralMessageArguments( content, row )
    const confirmation = await commandLib.sendMessageAndGetConfirmation( arguments, interaction )
    return { interaction: confirmation, value: confirmation.values[0] }
}