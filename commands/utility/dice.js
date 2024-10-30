const { SlashCommandBuilder } = require('discord.js');
const { GuildsReatingOfMembers } = require("../../memberRating.js")

let singleton = GuildsReatingOfMembers.getSingleton()


module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll-the-dice')
		.setDescription('roll the dice')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('predicted-number')
                .addChoices(
                    { name: '1', value: '1' },
                    { name: '2', value: '2' },
                    { name: '3', value: '3' },
                    { name: '4', value: '4' },
                    { name: '5', value: '5' },
                    { name: '6', value: '6' },
                )),
	async execute(interaction) {

        let target = interaction.member
		let guild = singleton.getGuildMembersReating( interaction.guild.id )
        let memberReating = guild.getMemberRatingById( target.id )

        const message = interaction.options.getString('input')
        const resultOfRollDice = Math.floor(Math.random()*6) + 1
        if ( message ) {
            if (resultOfRollDice == Number( message ) ) {
                await interaction.reply("you win!! drawn number is " + String( resultOfRollDice ));
                memberReating.addPoints( 10 )
            } else {
                await interaction.reply("you lose!! fool!! drawn number is " + String( resultOfRollDice ));
            }
        } else {
            await interaction.reply("drawn number is " + String( resultOfRollDice ));
        }
	},
};