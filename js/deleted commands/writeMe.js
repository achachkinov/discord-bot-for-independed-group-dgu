const  { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

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

        const confirm = new ButtonBuilder()
            .setCustomId('shutUp')
            .setLabel('shut up')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(confirm);

        const response = await interaction.reply( {
			content: message,
			components: [row],
		});

        await interaction.reply(`wait a second`);


        try {
            const confirmation = await response.awaitMessageComponent({ time: 60_000 });
        
            if (confirmation.customId === 'shutUp') {
                await confirmation.update({ content: ` fak u `, components: [] });
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
            console.log( e )
        }
	},
};