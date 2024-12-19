const { SlashCommandBuilder } = require('discord.js');
const { getOrCreateFromDataBase } = require("../../scripts/simpleFunctions/getOrCreateFromDataBase")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-special-message')
		.setDescription('only for admin. command for set special message')
        .addStringOption(option =>
            option.setName('message-name')
                .setDescription('chat name to set in config')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message-id')
                .setDescription('chat id to set in config')
                .setRequired(true)),
	async execute( interaction ) {
        const specialMessageName = interaction.options.getString('message-name')
        const specialMessageId = interaction.options.getString('message-id')
        let specialMessageNameDataBase = await getOrCreateFromDataBase( global.SpecialMessage, { guildId: interaction.guild.id, specialMessageName: specialMessageName }  )
        specialMessageNameDataBase.specialMessageId = specialMessageId
        specialMessageNameDataBase.save()
        await interaction.reply( `now ${ chatName } at index ${ chatId }` );
	},
};