const { announcementDeleteMessageInLog } = require("../announcementsScripts/announcementDeleteMessageInLog")
const { getPointsForMessage } = require("../simpleFunctions/getPointsForMessage")
const { addPointsToMember } = require("../simpleFunctions/addPointsToMember")
const { addValueToStatistic } = require("../simpleFunctions/addValueToStatistic")

async function handleMessageDelete( message, client ) {
    let points = getPointsForMessage( message )
    addPointsToMember( message, -points )
    addValueToStatistic( message, "amountOfCreatedMessage", -1 )
	await announcementDeleteMessageInLog( message, client )
}



module.exports = { handleMessageDelete }