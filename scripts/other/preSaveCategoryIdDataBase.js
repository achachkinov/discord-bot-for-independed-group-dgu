const { PermissionFlagsBits } = require('discord.js');
const { getRoleName } = require('../simpleFunctions/getAccessToCategoryRoleName.js');

function createOrUpdateAccessToCategoryRole( dataBase ) {
    createRole( dataBase ).then( ( roleId ) => {
        addPremissionToCategory( dataBase, roleId )
    })
}

async function createRole( dataBase ) {
    const roleName = getRoleName( dataBase )
    dataBase.accessToCategoryRoleName = roleName
    const guild = await global.client.guilds.fetch(dataBase.guildId);
    let roleDataBase = await global.RoleId.findOne( { guildId : dataBase.guildId, roleName: roleName } )
    if ( !roleDataBase ) {
        let role = await guild.roles.create({
            name: roleName,
            color: dataBase.categoryColor,
            permissions: [],
        })
        roleDataBase = new global.RoleId( { guildId : dataBase.guildId, roleName: roleName, roleId: role.id } )
        roleDataBase.save()
    }
    return roleDataBase.roleId
}

async function addPremissionToCategory( dataBase, roleId ) {
    const guildId = dataBase.guildId
    const categoryId = dataBase.categoryId

    const guild = await global.client.guilds.fetch(guildId);
    const category = await guild.channels.fetch(categoryId);
    const role = await guild.roles.fetch(roleId);

    // Check if the category and role exist
    if (!category || !role) {
        console.log('Category or role not found');
        return;
    }

    // Define the permission overwrites
    const permissionOverwrites = [
        {
            id: role.id, // Role ID
            allow: [PermissionFlagsBits.ViewChannel], // Permissions to allow
            deny: []
        }
    ];

    // Create or modify the category permissions
    try {
        await category.permissionOverwrites.set(permissionOverwrites);
        console.log(`Updated permissions for role: ${role.name} in category: ${category.name}`);
    } catch (error) {
        console.error('Error updating category permissions:', error);
    }
}

module.exports = { createOrUpdateAccessToCategoryRole }