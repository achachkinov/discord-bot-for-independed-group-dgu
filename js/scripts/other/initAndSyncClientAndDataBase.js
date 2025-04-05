const { syncDisplayByDataBase } = require("./syncDisplayByDataBase")

async function initAndSyncClientAndDataBase( client, Member, Guild ) {
	await initAndSync()
}

async function initAndSync() {
	let listOfGuilds = global.client.guilds.cache.toJSON()
	for ( let guild of listOfGuilds ) {
		await initAndSyncGuild( guild )
	}
}

async function initAndSyncGuild( guild ) {
	let guildDataBase = await getDataBaseOfGuild( guild )
	await initAndSyncAllMembersOfGuild( guild, guildDataBase )
}
async function getDataBaseOfGuild( guild ) {
	let guildDataBase = await global.Guild.findOne({ "guildId": `${guild.id}` });
	if (!guildDataBase) {
		guildDataBase = await new global.Guild({ "guildId": `${guild.id}` });
	}
	return guildDataBase
}

async function initAndSyncAllMembersOfGuild( guild, guildDataBase ) {
	let listOfmembers = guild.members.cache.toJSON()
	for ( let member of listOfmembers ) {
		if (member.bot) { continue }
		await initAndSyncMemberOfGuld( member, guild, guildDataBase )
	}
}

async function initAndSyncMemberOfGuld( member, guild, guildDataBase ) {///
	let memberDataBase = await global.Member.findOne({ "memberId": `${member.id}`, "guildId" : `${guild.id}` });
	if (!memberDataBase) {
		memberDataBase = new global.Member({ "memberId": `${member.id}`, "guildId" : `${guild.id}` });
		console.log( "nember " + member.id + " created" )
	}
	memberDataBase.nickname = member.user.globalName ?? member.user.username
	syncDisplayByDataBase( member, memberDataBase )
	await guildDataBase.save()
	await memberDataBase.save()
}

module.exports = { initAndSyncClientAndDataBase }


