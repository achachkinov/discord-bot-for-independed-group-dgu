async function updateMemberStatistic( dataBase ) {
    let memberDataBase = await global.Member.findOne( { guildId: dataBase.guildId, memberId: dataBase.memberId } )
	if ( dataBase.metaData.length != 0 ) {
		switch (dataBase.metaData) {
			case "medal":
				handleMedal(); break;
			case "channel":
				handleChannel(); break;
			case "category":
				handleCategory(); break;
		}
	} else {
		switch (dataBase.statisticName) {
			case "amountOfCreatedMessage":
				handleAmountOfCreatedMessage(dataBase, memberDataBase); break;
		}
	}
    memberDataBase.save()
}

function handleAmountOfCreatedMessage( dataBase, memberDataBase ) {
	switch ( dataBase.value ) {
		case 10:
			memberDataBase.roles.push( "10message" ); break;
		case 100:
			memberDataBase.roles.push( "100message" ); break;
		case 1000:
			memberDataBase.roles.push( "1000message" ); break;
		case 10000:
			memberDataBase.roles.push( "10000message" ); break;
		case 100000:
			memberDataBase.roles.push( "100000message" ); break;
	}
}

module.exports = { updateMemberStatistic }