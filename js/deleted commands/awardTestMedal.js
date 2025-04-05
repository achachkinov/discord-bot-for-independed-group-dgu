const { SlashCommandBuilder } = require('discord.js');
const { GuildsReatingOfMembers } = require('../memberRating.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('award-a-test-medal')
		.setDescription('award a test medal')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('The member to award a test medal')
            .setRequired(true)),
	async execute(interaction) {
        const member = interaction.options.getMember('target');
        const id = member.id
        const idGuild = interaction.guild.id
        let singleton = GuildsReatingOfMembers.getSingleton()
        let guild = singleton.getGuildMembersReating( idGuild )
        let memberReating = guild.getMemberRatingById( id )
        memberReating.awardMedal( "testMedalWitchStrangeName" )
		await interaction.reply(`${ member } got a test medal`);
	},
};