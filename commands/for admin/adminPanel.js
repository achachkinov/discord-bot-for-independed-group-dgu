const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, MessageFlags, ChannelSelectMenuBuilder, ChannelType, TextInputStyle, TextInputBuilder, ModalBuilder, channelLink} = require('discord.js');
const { sendModalAndGetConfirmation, sendMessageAndGetConfirmation, sendEphemeralMessage, sendMessage, getStringSelectMenu, getCategorySelectMenu, getChannelSelectMenu, getShortTextInput, getModal, handleSelectedOption, getEphemeralMessageArguments, getMessageArguments } = require('../../scripts/other/commandLib')
const { getOrCreateFromDataBase } = require("../../scripts/simpleFunctions/getOrCreateFromDataBase")
const { adminId } = require("../../configurations/env.json")
const channelTypes = require('../../configurations/listOfChannelTypes.json')

const options = [
	{
		label: '⚒📁⚙️создать/изменить категорию',
		value: 'createCategory',
		handlerOfOption: createCategory
	},
	{
		label: '💥📁удалить категорию',
		value: 'customizeCategory',
		handlerOfOption: deleteCategory
	},
	{
		label: '⚙️💬настроить чат',
		value: 'customizeChannel',
		handlerOfOption: customizeChannel
	},
	{
		label: '📃📁💬конфигурация категорий и чатов',
		value: 'configurationOfChats',
		handlerOfOption: configurationOfChannelAndCategories
	},
]

const optionsOfChannelTypes = getOptionsOfChannelTypes( channelTypes )

const data = new SlashCommandBuilder().setName('admin-panel').setDescription('only for admin')

module.exports = {
	data: data,
	execute : execute
};

async function execute( interaction ) {
    if ( isCanUseACommand(interaction) ) {
        createMainMenuMessage( interaction )
    } else {
        defaultReply( interaction )
    }
}

function isCanUseACommand( interaction ) {
    const isAdmin = interaction.user.id === adminId 
    return  isAdmin
}

function defaultReply( interaction ) {
    const content = "вам нельзя использовать панель админа"
    const messageArguments = getMessageArguments( content )
    interaction.reply( messageArguments )
}

async function createMainMenuMessage( interaction ) {
    const content = 'чего желаете'
    const optionSelectMenu = getStringSelectMenu( options )
    const row = new ActionRowBuilder().addComponents( optionSelectMenu );
    const arguments = getEphemeralMessageArguments( content, row )
    const confirmation = await sendMessageAndGetConfirmation( arguments, interaction )
    try {
        await handleSelectedOption( confirmation, options ) 
    } catch ( e ) {
        console.log( e )
    }
}


async function createCategory( interaction ) {
    const categoryValues = await getSelectedCategory( interaction, 'введите категорию' )
    const colorAndEmblemValues = await getSelectedColorAndEmlem( categoryValues.interaction )
    await saveCategory( categoryValues.value, colorAndEmblemValues.color, colorAndEmblemValues.emblem, colorAndEmblemValues.interaction )
    await sendMessageCreatedCategory( categoryValues.value, colorAndEmblemValues.color, colorAndEmblemValues.emblem, colorAndEmblemValues.interaction )
}

async function getSelectedCategory( interaction, content ) {
    const channelSelectMenu = getCategorySelectMenu( 'выберите категорию' )
    const row = new ActionRowBuilder().addComponents( channelSelectMenu );
    const arguments = getEphemeralMessageArguments( content, row )
    const confirmation = await sendMessageAndGetConfirmation( arguments, interaction )
    return { interaction: confirmation, value: confirmation.values[0] }
}

async function getSelectedColorAndEmlem( interaction ) {
    const textInputColor = getShortTextInput( 'введите цвет' )
    const rowColor = new ActionRowBuilder().addComponents( textInputColor );
    const textInputEmblem = getShortTextInput( 'введите эмблему' )
    const rowEmblem = new ActionRowBuilder().addComponents( textInputEmblem );
    const allRow = [ rowColor, rowEmblem ]
    const modal = getModal( allRow, 'введите данные о категории' )
    const confirmation = await sendModalAndGetConfirmation( modal, interaction )
    const color = confirmation.fields.getTextInputValue( 'введите цвет' )
    const emblem = confirmation.fields.getTextInputValue( 'введите эмблему' )
    return { interaction : confirmation, color : color, emblem : emblem }
}

async function saveCategory( categoryId, color, emblem, interaction ) {
    const guildId = interaction.guildId
    const category = await global.client.channels.fetch(categoryId)
    const categoryDataBase = await getOrCreateFromDataBase( global.CategoryId, { guildId : guildId, categoryId : categoryId } )
    categoryDataBase.categoryColor = color
    categoryDataBase.emblem = emblem
    categoryDataBase.categoryName = category.name
    categoryDataBase.save()
}

async function sendMessageCreatedCategory( categoryId, color, emblem, interaction ) {
    const category = await global.client.channels.fetch(categoryId)
    const categoryName = category.name
    const content = `конец опции, итоговая категория:\nимя: ${ categoryName }\nцвет: ${ color }\nэмблема: ${ emblem }`
    const arguments = getEphemeralMessageArguments( content )
    sendMessage( arguments, interaction )
}



async function deleteCategory( interaction ) {
    const categoryValues = await getSelectedCategory( interaction, 'введите категорию для удаления' )
    const result = await deleteCategoryInDataBaseAndGetResult( categoryValues.value, categoryValues.interaction )
    sendMessageOfResultDelete( categoryValues.value, categoryValues.interaction, result )
}

async function deleteCategoryInDataBaseAndGetResult( categoryId, interaction ) {
    const guildId = interaction.guildId
    const result = await global.CategoryId.deleteOne({ guildId : guildId, categoryId : categoryId });
    return result.deletedCount > 0
}

async function sendMessageOfResultDelete( categoryId, interaction, result ) {
    const category = await global.client.channels.fetch(categoryId)
    const categoryName = category.name
    if ( result ) {
        sendMessageSuccesDelete( interaction, categoryName )
    } else {
        sendMessageErrorWhenDeleting( interaction, categoryName )
    }
}

function sendMessageSuccesDelete( interaction, categoryName ) {
    const content = `категория: \'${categoryName}\' успешно удалена`
    sendEphemeralMessage( content, interaction)
}

function sendMessageErrorWhenDeleting( interaction, categoryName ) {
    const content = `не получилось удалить категорию: \'${categoryName}\'`
    sendEphemeralMessage( content, interaction)
}



async function customizeChannel( interaction ) {
    const content = 'выберите канал'
    const channelValues = await getSelectedChannel( interaction, content )
    const channelType = await getSelectedChannelType( channelValues.interaction )
    await saveChannelType( channelValues.value, channelType.value, channelType.interaction )
    sendMessageToCustomizeChannel( channelValues.value, channelType.value , channelType.interaction )
}

async function getSelectedChannel( interaction, content ) {
    const channelSelectMenu = getChannelSelectMenu( 'выберите канал' )
    const row = new ActionRowBuilder().addComponents( channelSelectMenu );
    const arguments = getEphemeralMessageArguments( content, row )
    const confirmation = await sendMessageAndGetConfirmation( arguments, interaction )
    return { interaction: confirmation, value: confirmation.values[0] }
}

async function getSelectedChannelType( interaction ) {
    const content = "выберите тип чата"
    const optionSelectMenu = getStringSelectMenu( optionsOfChannelTypes )
    const row = new ActionRowBuilder().addComponents( optionSelectMenu );
    const arguments = getEphemeralMessageArguments( content, row )
    const confirmation = await sendMessageAndGetConfirmation( arguments, interaction )
    return { interaction: confirmation, value: confirmation.values[0] }
}

function getOptionsOfChannelTypes( channelTypes ) {
    const channelTypeNames = Object.keys( channelTypes )
    let options = []
    for ( let channelTypeName of channelTypeNames ) {
        options.push( { label: channelTypeName, value: channelTypeName } )
    }
    return options
}

async function saveChannelType( channelId, channelType, interaction ) {
    const channelDataBase = await getOrCreateFromDataBase( global.ChatId, { guildId: interaction.guildId, chatId: channelId } )
    channelDataBase.chatType = channelType
    channelDataBase.save()
    if ( channelTypes[ channelType ].single ) {
        const channelDataBase = await global.ChatId.findOne( { guildId: interaction.guildId, chatType: channelType } )
        if( channelDataBase ) {
            channelDataBase.chatType = 'none'
            channelDataBase.save()
        }
    }
}

async function sendMessageToCustomizeChannel( channelId, channelType, interaction) {
    const channel = await global.client.channels.fetch(channelId)
    const channelName = channel.name
    const content = `чат ${ channelName } теперь имеет тип ${ channelType }`
    sendEphemeralMessage( content, interaction)
}



async function configurationOfChannelAndCategories( interaction ) {
    const configurationList = await getConfigurationChannelAndCategoruesList( interaction )
    const configurationMessage = createConfigurationMessage( configurationList )
    sendEphemeralMessage( configurationMessage, interaction )
}

async function getConfigurationChannelAndCategoruesList( interaction ) {
    const guild = await global.client.guilds.fetch( interaction.guildId );
    const channels = await guild.channels.cache.filter(channel => (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildForum ));
    const channelsArray = channels.toJSON()
    const categories = await guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory );
    const categoriesArray = categories.toJSON()
    const configurationList = {}
    await fillCategoriesList( configurationList, categoriesArray )
    await fillChannelList( configurationList, channelsArray )
    return configurationList
}
async function fillCategoriesList( configurationList, categoriesArray ) {
    for ( const category of categoriesArray ) {
        const categoryDataBase = await global.CategoryId.findOne( { guildId: category.guildId, categoryId: category.id } )
        if ( categoryDataBase ) {
            const categoryName = categoryDataBase.emblem + ' ┃ ' + categoryDataBase.categoryName
            configurationList[ category.id ] = { name: categoryName, channels: [] }
        } else {
            configurationList[ category.id ] = { name: category.name, channels: [] }
        }
    }
}
async function fillChannelList( configurationList, channelsArray ) {
    for ( const channel of channelsArray ) {
        const channelDataBase = await getOrCreateFromDataBase( global.ChatId, { guildId: channel.guildId, chatId: channel.id } )
        configurationList[ channel.parent.id ].channels.push( { name: channel.name, type: channelDataBase.chatType } )
    }
}
function createConfigurationMessage( configurationList ) {
    let message = 'конфигурация:\n'
    for ( const categoryId in configurationList ) {
        const category = configurationList[ categoryId ]
        message += '* ' + category.name + '\n'
        for ( let channel of category.channels ) {
            message += '  * ' + channel.name + ' : '+ channel.type + '\n'
        }
        message += '\n'
    }
    return message
}