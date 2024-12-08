const { syncDisplayByDataBase } = require("./syncDisplayByDataBase")

async function initAndSyncClientAndDataBase( client, Member, Guild ) {
	let initAndSyncFunct = new InitAndSyncFunction( client, Member, Guild )
	await initAndSyncFunct.initAndSync()
}


class InitAndSyncFunction {

		#client
		#Member
		#Guild

	constructor( client, Member, Guild ) {
		this.#client = client
		this.#Member = Member
		this.#Guild = Guild
	}

	async initAndSync() {
		let listOfGuilds = this.#client.guilds.cache.toJSON()
		for ( let guild of listOfGuilds ) {
			await this.#initAndSyncGuild( guild )
		}
	}

	async #initAndSyncGuild( guild ) {
		let guildDataBase = await this.#getDataBaseOfGuild( guild )
		await this.#initAndSyncAllMembersOfGuild( guild, guildDataBase )
	}
	async #getDataBaseOfGuild( guild ) {
		let guildDataBase = await this.#Guild.findOne({ "guildId": `${guild.id}` });
		if (!guildDataBase) {
			guildDataBase = await new this.#Guild({ "guildId": `${guild.id}` });
		}
		return guildDataBase
	}

	async #initAndSyncAllMembersOfGuild( guild, guildDataBase ) {
		let listOfmembers = guild.members.cache.toJSON()
		for ( let member of listOfmembers ) {
			if ( member.bot ) { continue }
			await this.#initAndSyncMemberOfGuld( member, guild, guildDataBase )
		}
	}
	
	async #initAndSyncMemberOfGuld( member, guild, guildDataBase ) {///
		let memberDataBase = await this.#Member.findOne({ "memberId": `${member.id}`, "guildId" : `${guild.id}` });
		if (!memberDataBase) {
			memberDataBase = new this.#Member({ "memberId": `${member.id}`, "guildId" : `${guild.id}` });
		}
		let findedElement = await this.#Guild.findOne({ guildId: `${guild.id}`, members: { $elemMatch: { memberId: `${member.id}` } } })
		if ( !findedElement ) {
			guildDataBase.members.push( memberDataBase )
			console.log( "nember " + member.id + " created" )
		}
		syncDisplayByDataBase( member, memberDataBase )
		await guildDataBase.save()
		await memberDataBase.save()
	}
}

module.exports = { initAndSyncClientAndDataBase }


