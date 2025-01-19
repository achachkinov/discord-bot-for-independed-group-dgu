const listOfStatisticAchivment = require('../../configurations/listOfStatisticAchivment.json')
const { getOrCreateFromDataBase } = require('../simpleFunctions/getOrCreateFromDataBase')
const { announcementGetMedalOfMember } = require('../announcementsScripts/announcementGetMedalOfMember')
const { announcementRemoveMedalOfMember } = require('../announcementsScripts/announcementRemoveMedalOfMember')

async function updateMemberStatistic( dataBase ) {
	if ( dataBase.isModified('value') ) {
		const statistic = listOfStatisticAchivment[ dataBase.statisticName ]
		for ( const medalName in statistic.medals ) {
			await updateMemberMedalStatus( dataBase, medalName, statistic )
		}
	}
}

async function updateMemberMedalStatus( dataBase, medalName, statistic ) {
	const medal = statistic.medals[ medalName ]
	const arguments = { guildId: dataBase.guildId, 
		memberId: dataBase.memberId, 
		medalName: medalName,
		medalType: dataBase.type,
		medalStatisticName : dataBase.statisticName,
		medalTypeData: dataBase.typeData,
		medalPoints: medal.points
	}
	const medalDataBase = getOrCreateFromDataBase( global.Medal, arguments )
	if ( (dataBase.value >= medal.frontier ) && ( !medalDataBase.isHave )) {
		medalDataBase.isHave = true
		const guild = await global.client.guilds.fetch( dataBase.guildId );
		const member = await guild.members.fetch( dataBase.memberId )
		member.points += medal.points
		announcementGetMedalOfMember()
	} else if ( (dataBase.value < medal.frontier ) && ( medalDataBase.isHave )) {
		medalDataBase.isHave = false
		const guild = await global.client.guilds.fetch( dataBase.guildId );
		const member = await guild.members.fetch( dataBase.memberId )
		member.points -= medal.points
		announcementRemoveMedalOfMember()
	}
}



module.exports = { updateMemberStatistic }