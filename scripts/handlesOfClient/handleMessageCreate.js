async function handleMessageCreate( message, Member ) {
    if (message.author.bot) return;
    await addPointsToMemberForCreateMessage( message, Member )
}

async function addPointsToMemberForCreateMessage( message, Member ) {
    let idMember = message.author.id
    let idGuild = message.guild.id
    let member = await Member.findOne({ "memberId" : idMember, "guildId": idGuild })
    member.statistic.amountOfCreatedMessage +=1
    member.points +=1
    member.save()
}

//const category = message.channel.parent;
module.exports = { handleMessageCreate }