const { token } = require('./configurations/env.json')
const { Client, Events, GatewayIntentBits } = require('discord.js');

const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/discordBotDGU', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const { initAllModels } = require("../scripts/other/initAllModels")
initAllModels()

const { setCommandsToClient } = require("../scripts/other/setCommandsToClient")

const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions ] });
global.client = client

setCommandsToClient( client )


const { initAndSyncClientAndDataBase } = require('../scripts/other/initAndSyncClientAndDataBase')

client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	await initAndSyncClientAndDataBase( client, Member, Guild )
});




const { handleMessageCreate } = require("../scripts/handlesOfClient/handleMessageCreate")
const { handleMessageDelete } = require("../scripts/handlesOfClient/handleMessageDelete")
const { handleThreadCreate } = require("../scripts/handlesOfClient/handleThreadCreate")
const { handleThreadDelete } = require("../scripts/handlesOfClient/handleThreadDelete")
const { handleReactionAdd } = require("../scripts/handlesOfClient/handleReactionAdd")
const { handleReactionRemove } = require("../scripts/handlesOfClient/handleReactionRemove")
const { handleInteractionCreate } = require("../scripts/handlesOfClient/handleInteractionCreate")
const { handleGuildMemberAdd } = require("../scripts/handlesOfClient/handleGuildMemberAdd")
const { handleGuildMemberRemove } = require("../scripts/handlesOfClient/handleGuildMemberRemove")




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