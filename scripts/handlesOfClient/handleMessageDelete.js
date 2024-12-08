const { announcementDeleteMessageInLog } = require("../announcementsScripts/announcementDeleteMessageInLog")

function handleMessageDelete( message, client ) {
    console.log("delete")
	announcementDeleteMessageInLog( message, client )
}



module.exports = { handleMessageDelete }