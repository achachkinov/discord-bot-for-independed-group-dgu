function syncDisplayByDataBaseAndClient( client, memberDataBase ) {
    let guild = client.guilds.cache.get( memberDataBase.guildId )
    let member = guild.members.cache.get( memberDataBase.memberId )
    syncDisplayByDataBase( member, memberDataBase )
}

function syncDisplayByDataBase( member, memberDataBase ) {
    let substringOfMemberLevel = "[ " + memberDataBase.level + " lvl ]"
    setSubstringToNickname( member, substringOfMemberLevel )
}

function setSubstringToNickname( member, substring ) {
    let nickname = member.user.globalName ?? member.user.username
    nickname += substring
    if ( member.manageable ) {
        member.setNickname( nickname )
    }
}

module.exports = { syncDisplayByDataBase, syncDisplayByDataBaseAndClient }