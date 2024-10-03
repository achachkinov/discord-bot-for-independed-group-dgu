const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('repeat')
		.setDescription('repeat message.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('message to repeat')
                .setRequired(true)),
	async execute(interaction) {
		await interaction.reply(`wait a moment.`);
        const message = interaction.options.getString('input')
        console.log( message )
        await interaction.followUp(message);
        await interaction.deleteReply();
	},
};