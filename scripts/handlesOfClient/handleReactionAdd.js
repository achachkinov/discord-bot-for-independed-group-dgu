const { addPointsToMember } = require("../simpleFunctions/addPointsToMember")
const { addValueToStatistic } = require("../simpleFunctions/addValueToStatistic")

function handleReactionAdd( interaction ) {
    addPointsToMember( interaction.message, 1 )
    addValueToStatistic( interaction, "amountOfGetReactions", 1 )
    addValueToStatistic( interaction, "amountOfCreatedReactions", 1 )
}

module.exports = { handleReactionAdd }
