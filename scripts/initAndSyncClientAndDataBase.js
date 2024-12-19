const { syncDisplayByDataBase } = require("./syncDisplayByDataBase")
const listOfRoles = require("../configurations/listOfRoles.json")

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
	await initAndSyncRoles( guild, guildDataBase )
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
		if ( member.bot ) { continue }
		await initAndSyncMemberOfGuld( member, guild, guildDataBase )
	}
}

async function initAndSyncMemberOfGuld( member, guild, guildDataBase ) {///
	let memberDataBase = await global.Member.findOne({ "memberId": `${member.id}`, "guildId" : `${guild.id}` });
	if (!memberDataBase) {
		memberDataBase = new global.Member({ "memberId": `${member.id}`, "guildId" : `${guild.id}` });
		guildDataBase.members.push( memberDataBase )
		console.log( "nember " + member.id + " created" )
	}
	syncDisplayByDataBase( member, memberDataBase )
	await guildDataBase.save()
	await memberDataBase.save()
}

async function initAndSyncRoles( guild, guildDataBase ) {
	for ( let roleName in listOfRoles ) {
		let roleDataBase = await global.RoleId.findOne( { "guildId" : guild.id, "roleName": roleName } )
		if ( !roleDataBase ) {
			let roleInConfig = listOfRoles[ roleName ]
			let role = await guild.roles.create({
				name: roleInConfig.name,
				color: roleInConfig.color,
				permissions: [],
			})
			const roleId = new global.RoleId( { "guildId" : guild.id, "roleName": roleName, "roleId": role.id } )
			roleId.save()
		}
	} 
}

module.exports = { initAndSyncClientAndDataBase }


