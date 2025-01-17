function syncDisplayByDataBaseAndClient( client, memberDataBase ) {
    let guild = client.guilds.cache.get( memberDataBase.guildId )
    let member = guild.members.cache.get( memberDataBase.memberId )
    syncDisplayByDataBase( member, memberDataBase )
}

function syncDisplayByDataBase( member, memberDataBase ) {
    const nickname = memberDataBase.nickname + "[ " + memberDataBase.level + " lvl ]"
    if ( member.manageable ) {
        member.setNickname( nickname )
    }
}

module.exports = { syncDisplayByDataBase, syncDisplayByDataBaseAndClient }