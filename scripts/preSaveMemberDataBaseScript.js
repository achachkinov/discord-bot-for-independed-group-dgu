const { syncDisplayByDataBaseAndClient } = require("./syncDisplayByDataBase")
const { CalculatorLevelOfMember } = require("./calculatorLevelOfMember")

function updateDisplayAndDataBase( client, dataBase ) {
    if ( dataBase.isModified( "roles" ) ) {
        updateDisplayAndDataBaseByRoles( client, dataBase )
    }

    if ( dataBase.isModified( "points" ) ) {
        updateDisplayAndDataBaseByPoints( client, dataBase )
    }
}


function updateDisplayAndDataBaseByRoles( client, dataBase ) {

    const originalAddresses = dataBase.getUpdate ? dataBase.getUpdate().addresses : dataBase.addresses; 
    const modifiedAddresses = dataBase.addresses;
    console.log( originalAddresses, modifiedAddresses )
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