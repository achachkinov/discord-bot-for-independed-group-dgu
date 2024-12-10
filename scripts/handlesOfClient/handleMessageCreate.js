async function handleMessageCreate( message, Member ) {
    if (message.author.bot) return;
    await addPointsToMemberForCreateMessage( message, Member )
}

async function addPointsToMemberForCreateMessage( message ) {
    let idMember = message.author.id
    let idGuild = message.guild.id

    let member = await global.Member.findOne({ memberId : idMember, guildId: idGuild })
    member.points +=1
    member.save()
    
    let statisticAmountOfCreatedMessage = await global.StatisticMember.findOne({ memberId : idMember, guildId: idGuild, statisticName :"amountOfCreatedMessage" })
    statisticAmountOfCreatedMessage.value += 1
    statisticAmountOfCreatedMessage.save()
}

//const category = message.channel.parent;
module.exports = { handleMessageCreate }