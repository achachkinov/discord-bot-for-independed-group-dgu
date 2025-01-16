async function deleteAccessToCategoryRole( query ) {
    await deleteRole( query )
}

async function deleteRole( argument ) {
    const query = argument.getQuery();
    const dataBase = await global.CategoryId.findOne( query );
    if( dataBase ) {
        const roleName = getRoleName( dataBase )
        try {
            const result = await global.RoleId.deleteOne( { guildId : dataBase.guildId, roleName: roleName } )
        } catch ( e ) {
            console.log( e )
        }
    }
}

function getRoleName( dataBase ) {
    const roleName = "🔑" + dataBase.emblem + "┃ доступ к \'" + dataBase.categoryName + "\'"
    return roleName
}

module.exports = { deleteAccessToCategoryRole }