const { syncDisplayByDataBaseAndClient } = require("./syncDisplayByDataBase")
const { CalculatorLevelOfMember } = require("./calculatorLevelOfMember")

function updateDisplayAndDataBase( dataBase ) {
    if ( dataBase.isModified( "points" ) ) {
        updateDisplayAndDataBaseByPoints( global.client, dataBase )
    }
}

function updateDisplayAndDataBaseByPoints( client, dataBase ) {
    const newLevel = CalculatorLevelOfMember.getLevelByPoints( dataBase.points )
    if ( dataBase.level != newLevel ) {
        announceAboutChangeLevel( client, newLevel )
        dataBase.level = newLevel
    }
    syncDisplayByDataBaseAndClient( client, dataBase )
}

function announceAboutChangeLevel( client, dataBase, newLevel ) {
    console.log("update")
}


module.exports = { updateDisplayAndDataBase }