const { getOrCreateFromDataBase } = require("../simpleFunctions/getOrCreateFromDataBase")

async function addValueToStatistic( interaction, statisticName, value, metadata = [] ) {
    let request = { memberId : interaction.author.id, guildId: interaction.guild.id, statisticName :statisticName, metaData: metadata }
    let statistic = await getOrCreateFromDataBase( global.StatisticMember, request ) 
    statistic.value += value
    statistic.save()
}

module.exports = { addValueToStatistic }

