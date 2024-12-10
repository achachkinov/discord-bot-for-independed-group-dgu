const { token } = require('./configurations/env.json')
const { Client, Events, GatewayIntentBits } = require('discord.js');

const mongoose = require("mongoose")
const { guildSchema } = require("./schemes/guildSchema")
const { memberSchema } = require("./schemes/memberSchema")
const { chatIdSchema } = require("./schemes/chatIdSchema")
const { roleIdSchema } = require("./schemes/roleIdSchema")
const { statisticSchema } = require("./schemes/statisticSchema")

mongoose.connect('mongodb://localhost:27017/discordBotDGU', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const { updateDisplayAndDataBase } = require('./scripts/preSaveMemberDataBaseScript')
const { updateMemberStatistic } = require('./scripts/preSaveStatisticDataBaseScript')

memberSchema.pre('save', function(next) {
    updateDisplayAndDataBase( client, this )
    next();
});

statisticSchema.pre('save', function(next) {
    updateMemberStatistic( client, this )
    next();
});


const Guild = mongoose.model('Guild', guildSchema);
const Member = mongoose.model('Member', memberSchema);
const ChatId = mongoose.model('ChatId', chatIdSchema)
const RoleId = mongoose.model('RoleId', roleIdSchema)
const StatisticMember = mongoose.model('StatisticMember', statisticSchema)

global.Guild = Guild
global.Member = Member
global.ChatId = ChatId
global.RoleId = RoleId
global.StatisticMember = StatisticMember


const { setCommandsToClient } = require("./scripts/setCommandsToClient")

const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences ] });
global.client = client

setCommandsToClient( client )


const { initAndSyncClientAndDataBase } = require('./scripts/initAndSyncClientAndDataBase')

client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	await initAndSyncClientAndDataBase( client, Member, Guild )
});




const { handleMessageCreate } = require("./scripts/handlesOfClient/handleMessageCreate")
const { handleMessageDelete } = require("./scripts/handlesOfClient/handleMessageDelete")
const { handleThreadCreate } = require("./scripts/handlesOfClient/handleThreadCreate")
const { handleThreadDelete } = require("./scripts/handlesOfClient/handleThreadDelete")
const { handleReactionAdd } = require("./scripts/handlesOfClient/handleReactionAdd")
const { handleReactionRemove } = require("./scripts/handlesOfClient/handleReactionRemove")
const { handleInteractionCreate } = require("./scripts/handlesOfClient/handleInteractionCreate")
const { handleGuildMemberAdd } = require("./scripts/handlesOfClient/handleGuildMemberAdd")
const { handleGuildMemberRemove } = require("./scripts/handlesOfClient/handleGuildMemberRemove")




client.on( Events.MessageCreate, async ( message ) => { 
    handleMessageCreate( message, Member )
})

client.on( Events.MessageDelete, async ( message ) => { 
	handleMessageDelete( message, client )
})

client.on( Events.ThreadCreate, async ( interaction ) => {
    handleThreadCreate( interaction )
})

client.on( Events.ThreadDelete, async ( interaction ) => {
    handleThreadDelete( interaction )
})

client.on( Events.MessageReactionAdd, async ( interaction ) => {
    handleReactionAdd( interaction )
})

client.on( Events.MessageReactionRemove, async ( interaction ) => {
    handleReactionRemove( interaction )
})

client.on( Events.InteractionCreate, async ( interaction ) => {
    handleInteractionCreate( interaction )
});

client.on( Events.GuildMemberAdd, async ( interaction ) => {
    handleGuildMemberAdd( interaction )
})

client.on( Events.GuildMemberRemove, async ( interaction ) => {
    handleGuildMemberRemove( interaction )
})


client.login(token)