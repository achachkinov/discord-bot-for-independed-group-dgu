async function addPointsToMember( interaction, points ) {
    let member = await global.Member.findOne({ memberId : interaction.author.id, guildId: interaction.guild.id })
    member.points += points
    member.save()
}

module.exports = { addPointsToMember }