const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { CalculatorLevelOfMember } = require("../../scripts/other/calculatorLevelOfMember")
const { isBotChat } = require("../../scripts/simpleFunctions/isBotChat")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRow, StringSelectMenuBuilder, ChannelSelectMenuBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } = require('discord.js');




module.exports = {
	data: new SlashCommandBuilder()
		.setName('test-command')
		.setDescription('Provides information about the user.')
		.addUserOption(option =>
            option.setName('target')
            .setDescription('The member to ban')),
    async execute(interaction) {
		if (isBotChat(interaction)) {
			const channelSelectMenu = new ChannelSelectMenuBuilder()
       			.setCustomId('channel_select_id')
       			.setPlaceholder('Выберите канал');

			const textInput1 = new TextInputBuilder()
			.setCustomId('textInput')  // Уникальный ID для текстового ввода
			.setLabel('Введите текст') // Текст метки
			.setStyle(TextInputStyle.Short); // Тип ввода (SHORT или PARAGRAPH)
			const textInput2 = new TextInputBuilder()
			.setCustomId('textInput2')  // Уникальный ID для текстового ввода
			.setLabel('Введите текст') // Текст метки
			.setStyle(TextInputStyle.Short); // Тип ввода (SHORT или PARAGRAPH)
			const textInput3 = new TextInputBuilder()
			.setCustomId('textInput3')  // Уникальный ID для текстового ввода
			.setLabel('Введите текст') // Текст метки
			.setStyle(TextInputStyle.Short); // Тип ввода (SHORT или PARAGRAPH)
	
			// Создаем ряд и добавляем в него текстовое поле
			const row = new ActionRowBuilder().addComponents(textInput1);
			const row2 = new ActionRowBuilder().addComponents(textInput2);
	
			// Создаем модальное окно
			const modal = new ModalBuilder()
				.setCustomId('modalId') // Уникальный ID для модального окна
				.setTitle('Модальное окно') // Заголовок модального окна
				.addComponents(row, row2); // Добавляем ряд с текстовым вводом в модальное окно
	
			// Отправляем модальное окно
			await interaction.showModal(modal);

            const row3 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('primary')
                        .setLabel('Primary Button')
                        .setStyle(ButtonStyle.Primary),
                    new StringSelectMenuBuilder()
                        .setCustomId('select')
                        .setPlaceholder('Nothing selected')
                        .addOptions([
                            {
                                label: 'Option 1',
                                value: 'option1',
                            },
                            {
                                label: 'Option 2',
                                value: 'option2',
                            },
                        ]));
			//const row2 = new ActionRowBuilder().addComponents( textInput )

            //await interaction.reply({ content: 'Click the button!', components: [ row2 ] });

			let guildId = interaction.guild.id
			let target = interaction.options.getMember('target') ?? interaction.member
			let memberDataBase = await global.Member.findOne({ "memberId": target.id, "guildId": guildId })
			let level = memberDataBase.level
			let points = memberDataBase.points
			let pointsOnLevel = CalculatorLevelOfMember.getPointOnLevel(points)
			let pointsForCompleteLevel = CalculatorLevelOfMember.getPointsToNextLevel(points)
			let nickname = target.user.globalName ?? target.user.username
			let progressBar = getProgressBar(pointsOnLevel, pointsOnLevel + pointsForCompleteLevel)
			let embed = new EmbedBuilder()
				.setTitle(`LEVEL: ${level}`)
				.setAuthor({ name: `${nickname}`, iconURL: `${target.user.displayAvatarURL() ?? interaction.user.defaultAvatarURL}` })
				.setColor(target.displayHexColor)
				.addFields(
					{ name: 'points: ', value: `${points}` },
					{ name: "progress:", value: progressBar },
					{ name: "points on level: ", value: `${pointsOnLevel}`, inline: true },
					{ name: "points for complete level: ", value: `${pointsForCompleteLevel}`, inline: true },
				)
				.setFooter({ text: ' not bad, nod bad ' })
				.setTimestamp(interaction.createdAt);
			//await interaction.reply({ embeds: [embed] });
		}
	},
};


function getProgressBar( pointsOnLevel, pointsForCompleteLevel ) {
	let progressBarSize = 10
	let progressBarArray = new Array( progressBarSize )
	progressBarArray.fill("⬛️")
	let progressBarFillLevel = Math.floor((pointsOnLevel/pointsForCompleteLevel) * progressBarSize)
	for ( let i = 0; i < progressBarFillLevel; i++ ) {
		progressBarArray[ i ] = "🟦"
	}
	let progressBar = progressBarArray.join("")
	return progressBar
}	