const fs = require('node:fs');
const path = require('node:path');
const { clientId, guildId, token, deletedMessageLog } = require('./config.json');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder  } = require('discord.js');
const { GuildsReatingOfMembers } = require('./memberRating.js')


const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences ] });
const guildsReatingOfMembers = GuildsReatingOfMembers.getSingleton()



global.client = client



client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}





client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	guildsReatingOfMembers.setClient( client )
});



client.on( Events.MessageDelete, message => {
	console.log("delete")
	let embed = new EmbedBuilder()
		.setTitle('Было удалено сообщение!')
		.setColor(0xFF0000)
		.addFields(
			{ name: 'Удалённое сообщение: ', value: `${message.content}`},
			{ name: "Автор: ", value:`${message.author.tag} (${message.author})`, inline: true  },
			{ name: "Канал: ", value: `${message.channel}`, inline: true },
		)
		.setFooter({ text: ' - ', iconURL: `${message.author.avatarURL()}` })
		.setTimestamp(message.createdAt);
	client.channels.cache.get( deletedMessageLog ).send({ embeds: [embed] }); // айди вашего канала с логами
})




client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});




client.on(Events.MessageCreate, message =>{ // ивент, когда приходит любое сообщение в чат https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-message
    if (message.author.bot) return; // если автор сообщения - бот, ничего не происходит 
    if (message.content == 'S') { // если пользователь написал "!профиль" 
		let embed = new Discord.MessageEmbed() // создание ембед сообщения
		.setTitle(message.author.username) // в тайтле имя автора 
		let status = ''
		switch (message.author.presence.status) { // проверка статусов 
			case 'online':
				status = 'онлайн'; break; 
				case 'idle':
					status = ':orange_circle:нет на месте'; break;
					case 'offline':
						status = 'нет в сети'; break;
						case 'dnd':
							status = ':red_circle:не беспокоить'; break;
		}
		embed.setDescription(`**Ваш дискорд айди: ${message.author.id}
		Ваш статус: ${status}
		Дата создания аккаунта: ${message.author.createdAt.toLocaleDateString()}
		Дата входа на сервер: ${message.member.joinedAt.toLocaleDateString()}
		**`) // описание ембеда
		.setColor('RANDOM') // рандомный цвет ембеда
		.setThumbnail(message.author.avatarURL()) // вставляем в ембед аватарку пользователя
		message.channel.send(embed) // отправляем сообщение в канал где была написана команда   
    } else {
		addPointsToMemberForCreateMessage( message )
	}
})


function addPointsToMemberForCreateMessage( message ) {
	let idMember = message.author.id
	let idGuild = message.guild.id
	let guildReatingOfMembers = guildsReatingOfMembers.getGuildMembersReating( idGuild )
	let memberRating = guildReatingOfMembers.getMemberRatingById( idMember )
	memberRating.addPoint()
	let amountOfCreatedMessages = memberRating.getIndicator( "amountOfCreatedMessages" )
	amountOfCreatedMessages+=1
	memberRating.setIndicator( "amountOfCreatedMessages", amountOfCreatedMessages )
	awardAMedalIfLineCrossed( memberRating, amountOfCreatedMessages )
}

function awardAMedalIfLineCrossed( memberRating, amountOfCreatedMessages ) {
	switch ( amountOfCreatedMessages ) {
		case 10:
			memberRating.awardMedal( "10message" ); break;
		case 100:
			memberRating.awardMedal( "100message" ); break;
		case 1000:
			memberRating.awardMedal( "1000message" ); break;
		case 10000:
			memberRating.awardMedal( "10000message" ); break;
		case 100000:
			memberRating.awardMedal( "100000message" ); break;
	}
}

// client.on('guildMemberAdd', member =>{ // ивент, когда пользователь присоединяется к серверу https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
//     let embed = new Discord.MessageEmbed()
//     .setThumbnail(member.user.avatarURL())
//     .setTitle(`Привет, ${member.user.username}!`)
//     .setDescription(`**Ты попал на мой сервер!
//     Ты наш \`${client.guilds.get("АЙДИ СЕРВЕРА").memberCount}\` участник! **`) // айди вашего сервера               !!!!!!!!!!
//     .setFooter('Будь всегда на позитиве :3', 'https://cdn.discordapp.com/emojis/590614597610766336.gif?v=1')
//     // .addField(`Участвуй в розыгрышах!`, `<#706487236220289054>`, true) // Добавляйте свои каналы по желанию
//     // .addField(`Общайся в чате!`, `<#702364684199788625>`, true)
//     // .addField(`Смотри видео наших ютуберов!`, `<#702363551184060546>`, true)
//     .setColor('RANDOM')
//     member.send(embed); // отправка сообщения в лс 

//     let embed2 = new Discord.MessageEmbed()
//     .setThumbnail(member.user.avatarURL())
//     .setTitle(`Пользователь вошел на сервер`)
//     .addField('Пользователь:', member.user)
//     .setColor('RANDOM')
//     member.send(embed);
//     client.channels.cache.get('АЙДИ КАНАЛА С ЛОГАМИ').send(embed2) // айди вашего канала с логами
// })

// client.on('guildMemberRemove', member => { // ивент, когда пользователь выходит с сервера https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
//     let embed = new Discord.MessageEmbed()
//     .setThumbnail(member.user.avatarURL())
//     .setTitle(`Пользователь покинул сервер`)
//     .addField('Пользователь:', member.user)
//     .setColor('RANDOM')
//     member.send(embed);
//     client.channels.cache.get('АЙДИ КАНАЛА С ЛОГАМИ').send(embed) // айди вашего канала с логами
//   })

// async function change() {
//     let members = client.guilds.cache.get("АЙДИ ВОЙСА").memberCount // сколько людей на сервере + указать айди своего сервера
//     client.channels.cache.get("АЙДИ СЕРВЕРА").setName(`На сервере: ${members}`); // свой айди войса
// }

// var interval = setInterval(function () { change(); }, 20000  ); // время обновления в миллисекундах

 // токен вашего бота
client.login(token)