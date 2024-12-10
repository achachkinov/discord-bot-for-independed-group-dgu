const { announcementDeleteMessageInLog } = require("../announcementsScripts/announcementDeleteMessageInLog")

async function handleMessageDelete( message, client ) {
    console.log("delete")
	await announcementDeleteMessageInLog( message, client )
}



module.exports = { handleMessageDelete }