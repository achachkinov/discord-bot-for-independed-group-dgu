const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, MessageFlags, ChannelSelectMenuBuilder, ChannelType, TextInputStyle, TextInputBuilder, ModalBuilder, channelLink} = require('discord.js');

async function sendModalAndGetConfirmation( modal, interaction ) {
    await interaction.showModal( modal )
    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        const confirmation = await interaction.awaitModalSubmit({ filter: collectorFilter, time: 60_000 });
        return confirmation
    } catch (e) {
        console.log( e )
        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
    }
}

async function sendMessageAndGetConfirmation( messageArguments, interaction ) {
    let response = await sendMessage( messageArguments, interaction )
    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        return confirmation
    } catch (e) {
        console.log( e )
        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
    }
}

async function sendEphemeralMessage( content, interaction) {
    const arguments = getEphemeralMessageArguments( content )
    sendMessage( arguments, interaction )
}

async function sendMessage( messageArguments, interaction ) {
    if ( isNotCreatedMessageReply( interaction ) ) {
        return await interaction.reply( messageArguments );
    } else {
        return await interaction.update( messageArguments );
    }
}

function isNotCreatedMessageReply( interaction ) {
    return interaction.commandId
}

function getEphemeralMessageArguments( content, row ) {
    const messageArguments = getMessageArguments( content, row )
    messageArguments.flags = MessageFlags.Ephemeral
    return messageArguments
}

function getMessageArguments( content, row ) {
    const components = []
    if ( row ) { components.push( row ) }
    const messageArguments = { content : content, components : components  }
    return messageArguments
}

function getStringSelectMenu( options, plaseHolder = 'Nothing selected' ) {
    const stringSelectMenu = new StringSelectMenuBuilder()
        .setCustomId('select')
        .setPlaceholder(plaseHolder)
        .addOptions(options)
    return stringSelectMenu
}

function getCategorySelectMenu( plaseHolder ) {
    const categorySelectMenu = new ChannelSelectMenuBuilder()
        .setCustomId('category_select_id')
        .setPlaceholder( plaseHolder )
        .addChannelTypes( ChannelType.GuildCategory );
    return categorySelectMenu
}

function getChannelSelectMenu( plaseHolder ) {
    const categorySelectMenu = new ChannelSelectMenuBuilder()
    .setCustomId( plaseHolder )
    .setPlaceholder( plaseHolder )
    .addChannelTypes( ChannelType.GuildText, ChannelType.GuildForum );
return categorySelectMenu
}

function getShortTextInput( plaseHolder ) {
    const shortTextInput = new TextInputBuilder()
        .setCustomId(plaseHolder)
        .setLabel(plaseHolder)
        .setStyle(TextInputStyle.Short);
    return shortTextInput
}

function getModal( row, setPlaceholder ) {
    const modal = new ModalBuilder()
        .setCustomId(setPlaceholder)
        .setTitle(setPlaceholder)
        .addComponents( row );
    return modal
}

async function createMainMenuMessage( content, options, interaction ) {
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

async function handleSelectedOption( interaction, options ) {
	for ( let option of options ) {
		if ( option.value == interaction.values[0] ) {
			await option.handlerOfOption( interaction )
		}
	}
}


module.exports = { sendModalAndGetConfirmation, 
    sendMessageAndGetConfirmation, 
    sendEphemeralMessage, 
    sendMessage, 
    getStringSelectMenu, 
    getCategorySelectMenu, 
    getChannelSelectMenu, 
    getShortTextInput, 
    getModal, 
    handleSelectedOption,
    getEphemeralMessageArguments,
    getMessageArguments,
    createMainMenuMessage
}