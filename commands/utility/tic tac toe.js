const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
//const { MembersRatingCollection } = require("../../memberRating.js")

//let membersRatingCollection = MembersRatingCollection.getCollcetion()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tic-tac-toe')
		.setDescription('Provides information about the user.')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('The member to play')
            .setRequired(true)),
	async execute(interaction) {
        const id = interaction.user.id
        const idTarget = interaction.options.getUser('target')

        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('yes of course')
            .setStyle(ButtonStyle.Success);

        const disagree = new ButtonBuilder()
            .setCustomId('disagree')
            .setLabel('nO')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(confirm)
            .addComponents( disagree );

        const response = await interaction.reply({
            content: `${idTarget} you ready to start play tic tac toe with <@${ id }>?`,
            components: [row],
        });


        const collectorFilter = i => i.user.id === idTarget.id;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if (confirmation.customId === 'confirm') {
                await confirmation.update({ content: `game not done, play something else`, components: [] });
            } else if (confirmation.customId === 'disagree') {
                await confirmation.update({ content: 'its all your will', components: [] });
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
	},
};