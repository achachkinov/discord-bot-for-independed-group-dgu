const { syncDisplayByDataBaseAndClient } = require("./syncDisplayByDataBase")
const { CalculatorLevelOfMember } = require("./calculatorLevelOfMember")

function updateDisplayAndDataBase( client, dataBase ) {
    if ( dataBase.isModified( "statistic" ) ) {
        updateDataBaseByStatistic( dataBase )
    }
    if ( dataBase.isModified( "roles" ) ) {
        updateDisplayAndDataBaseByRoles( client, dataBase )
    }

    if ( dataBase.isModified( "points" ) ) {
        updateDisplayAndDataBaseByPoints( client, dataBase )
    }
}

function updateDataBaseByStatistic( dataBase ) {

}

function awardAMedalIfLineCrossed( memberRating, amountOfCreatedMessages ) {
	switch ( amountOfCreatedMessages ) {
		case 10:
			memberRating.awardMedal( "10message" ); break;
		case 100:
			memberRating.awardMedal( "100message" ); break;
		case 1000:
			memberRating.awardMedal( "1000message" ); break;
		case 10000:
			memberRating.awardMedal( "10000message" ); break;
		case 100000:
			memberRating.awardMedal( "100000message" ); break;
	}
}


function updateDisplayAndDataBaseByRoles( client, dataBase ) {
    //updateRoles( client, dataBase )
    const originalAddresses = dataBase.getUpdate ? dataBase.getUpdate().addresses : dataBase.addresses; 
    const modifiedAddresses = dataBase.addresses; // Текущие адреса
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