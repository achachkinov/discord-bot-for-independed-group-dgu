const { syncDisplayByDataBaseAndClient } = require("./syncDisplayByDataBase")
const { CalculatorLevelOfMember } = require("./calculatorLevelOfMember")
const { announcementChangeLevelOfMember } = require('../announcementsScripts/announcementChangeLevelOfMember')

function updateDisplayAndDataBase( dataBase ) {
    if ( dataBase.isModified( "points" ) || dataBase.isModified( "nickname" )) {
        updateDisplayAndDataBaseByPoints(  dataBase )
    }
}

function updateDisplayAndDataBaseByPoints( dataBase ) {
    const newLevel = CalculatorLevelOfMember.getLevelByPoints( dataBase.points )
    if ( dataBase.level != newLevel ) {
        dataBase.level = newLevel
        announcementChangeLevelOfMember( dataBase )
    }
    syncDisplayByDataBaseAndClient( global.client, dataBase )
}


module.exports = { updateDisplayAndDataBase }