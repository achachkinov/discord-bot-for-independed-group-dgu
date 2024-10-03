const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('write-me')
		.setDescription('Provides information about the user.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('message to repeat')
                .setRequired(true)),
	async execute(interaction) {
        const id = interaction.user.id
        const message = interaction.options.getString('input')
        client.users.send( id, message);
        await interaction.reply(`wait a second`);
		console.log( interaction )
	},
};