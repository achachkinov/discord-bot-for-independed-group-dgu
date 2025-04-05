async function updateMemberRole( dataBase  ) {
    if ( dataBase.isModified( "enable" ) ) {
        const guild = await global.client.guilds.fetch( dataBase.guildId );
        const member = await guild.members.fetch( dataBase.memberId )
        const roleDataBase = await global.RoleId.findOne( { guildId: dataBase.guildId, roleName: dataBase.roleName } )
        const role = await guild.roles.fetch( roleDataBase.roleId )
        try {
            if ( dataBase.enable ) {
                await member.roles.add(role);
            } else {
                await member.roles.remove(role);
            }
        } catch ( e ) {
            console.log( e )
        }
    }
}

module.exports = { updateMemberRole }