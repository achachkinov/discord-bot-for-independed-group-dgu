function getRoleName( dataBase ) {
    const roleName = "🔑" + dataBase.emblem + "┃ доступ к \'" + dataBase.categoryName + "\'"
    return roleName
}

module.exports = { getRoleName }