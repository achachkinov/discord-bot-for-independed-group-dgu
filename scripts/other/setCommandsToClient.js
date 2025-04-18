const fs = require('node:fs');
const path = require('node:path');
const { Collection } = require('discord.js');

function setCommandsToClient( client ) {
    client.commands = new Collection();

    const parentDir = path.join(__dirname, '../../');
    const foldersPath = path.join(parentDir, 'commands');
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
}

module.exports = { setCommandsToClient }