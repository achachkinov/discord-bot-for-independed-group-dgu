import env from '../../../resources_and_config/env.json';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { MessageObservable } from '../messageObservers/MessageObservable';

console.log("Hello from TypeScript! 2");

const client = new Client({ 
    intents: [
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildPresences, 
        GatewayIntentBits.GuildMessageReactions 
    ] 
});

const messageObservable: MessageObservable = new MessageObservable();

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, message => {
    messageObservable
});

client.login(env.token)