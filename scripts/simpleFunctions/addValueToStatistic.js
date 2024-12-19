const { getOrCreateFromDataBase } = require("../simpleFunctions/getOrCreateFromDataBase")

async function addValueToStatistic( interaction, statisticName, value ) {
    let request = { memberId : interaction.author.id, guildId: interaction.guild.id, statisticName :statisticName }
    let statistic = await getOrCreateFromDataBase( global.StatisticMember, request ) 
    statistic.value += value
    statistic.save()
}

module.exports = { addValueToStatistic }

