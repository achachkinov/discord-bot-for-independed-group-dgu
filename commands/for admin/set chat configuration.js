const { SlashCommandBuilder } = require('discord.js');
const { getOrCreateFromDataBase } = require("../../scripts/simpleFunctions/getOrCreateFromDataBase")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-chat-configuration')
		.setDescription('only for admin. command for set chat config')
        .addStringOption(option =>
            option.setName('chat-name')
                .setDescription('chat name to set in config')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('chat-id')
                .setDescription('chat id to set in config')
                .setRequired(true)),
	async execute( interaction ) {
        const chatName = interaction.options.getString('chat-name')
        const chatId = interaction.options.getString('chat-id')
        let chatIdDataBase = await getOrCreateFromDataBase( global.ChatId, { guildId: interaction.guild.id, chatName: chatName }  )
        chatIdDataBase.chatId = chatId
        chatIdDataBase.save()
        await interaction.reply( `now ${ chatName } at index ${ chatId }` );
	},
};