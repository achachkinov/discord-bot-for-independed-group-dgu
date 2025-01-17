const { getOrCreateFromDataBase } = require("../simpleFunctions/getOrCreateFromDataBase")
const listOfStatisticAchivment = require("../../configurations/listOfStatisticAchivment.json")

async function addValueToStatistic( interaction, statisticName, value ) {
    const typesOfStatistic = listOfStatisticAchivment[ statisticName ].type
    for ( const type in typesOfStatistic ) {
        const request = { memberId : interaction.author.id, guildId: interaction.guild.id, statisticName: statisticName, type: type }
        if ( type == "channel" ) {
            request.typeData = interaction.channel.id
        } else if ( type == "category" ) {
            request.typeData = interaction.channel.parent.id
        }
        const statistic = await getOrCreateFromDataBase( global.StatisticMember, request ) 
        statistic.value += value
        statistic.save()
    }
}

module.exports = { addValueToStatistic }

