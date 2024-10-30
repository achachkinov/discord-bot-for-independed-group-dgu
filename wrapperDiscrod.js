const { readFileSync, writeFileSync } = require('fs');
const { JsonFileReaderAndSync } = require('./jsonFileReaderAndSync')

class WrapperClient {

        #client
        #listOfRoles
        #wrapperGuildsList = {}

    getWrapperGuildById( id ) {
        try {
            this.#createWrapperGuildIfDontExit( id )
            return this.#wrapperGuildsList[ id ]
        } catch ( e ) {
            console.log( e )
        }
    }
    #createWrapperGuildIfDontExit( id ) {
        if ( this.#isNotWrapperGuildInList( id ) ) {
            let wrapperGuild = this.#createWrapperGuild( id )
            this.#wrapperGuildsList[ id ] = wrapperGuild
        }
    }
    #isNotWrapperGuildInList( id ) {
        return !( id in this.#wrapperGuildsList)
    }
    #createWrapperGuild( id ) {
        let guild = this.#client.guilds.cache.get( id )
        let wrapperGuild = new WrapperGuild()
        wrapperGuild.setGuild( guild )
        return wrapperGuild
    }

    setClient( client ) {
        this.#client = client
        this.#createWrapperGuildsList()    
    }
    #createWrapperGuildsList() {
        let listOfGuilds = this.#client.guilds.cache.toJSON()
        for ( let guild of listOfGuilds ) {
            this.#setGuildInList( guild )
        }
    }
    #setGuildInList( guild ) {
        let guildId = guild.id
        let wrapperGuild = new WrapperGuild()
        wrapperGuild.setGuild( guild )
        this.#wrapperGuildsList[ guildId ] = wrapperGuild
    }
    
    setListOfRoles( listOfRoles ) {
        this.#listOfRoles = listOfRoles
        this.#updateListOfRolesInGuildWrappers()
    }
    #updateListOfRolesInGuildWrappers() {
        for ( let guildId in this.#wrapperGuildsList ) {
            let guild = this.#wrapperGuildsList[ guildId ]
            guild.setListOfRoles( this.#listOfRoles )
        }
    }


    static getSingleton() {
        return WrapperClient.prototype.singleton
    }
}
WrapperClient.prototype.singleton = new WrapperClient()



class WrapperGuild {

        #guild
        #wrapperRolesOfGuild
        #configOfGuildJson

    getWrapperMember( id ) {
        let wrapperMember = new WrapperMember()
        wrapperMember.setId( id )
        wrapperMember.setWrapperGuild( this )
        return wrapperMember
    }

    setRoleToMember( id, role ) {
        let guildRole = this.#wrapperRolesOfGuild.getRole( role )
        this.#guild.members.cache.get( id ).roles.add( guildRole )
    }
    deleteRoleOfMember( id, role ) {
        let guildRole = this.#wrapperRolesOfGuild.getRole( role )
        this.#guild.members.cache.get( id ).roles.remove( guildRole )
    }
    setSubstringToMember( id, substring ) {
        let member = this.#guild.members.cache.get( id )
        let nickname = member.user.globalName
        if ( !nickname ) {
            nickname = member.user.username
        }
        nickname += substring
        if ( member.manageable ) {
            member.setNickname( nickname )
        }
    }
    writeToMember( id, text ) {
        let member = this.#guild.members.cache.get( id )
        let totalText = `${member} ` + text
        let chatBotId = this.#configOfGuildJson.chatBotId
        let channel = client.channels.cache.get( chatBotId );
        channel.send( totalText )
    }

    setGuild( guild ) {
        this.#guild = guild
        this.#wrapperRolesOfGuild = new WrapperRolesOfGuild()
        this.#wrapperRolesOfGuild.setGuild( guild )
        this.#getConfigOfGuildJson()
    }
    #getConfigOfGuildJson() {
        let id = this.#guild.id
        let pathOfConfig = `./guildsInfo/guild_${id}/configOfGuild.json`
        let json = readFileSync( pathOfConfig , 'utf8' );
        this.#configOfGuildJson = JSON.parse(json);
    }
    setListOfRoles( listOfRoles ) {
        this.#wrapperRolesOfGuild.setListOfRoles( listOfRoles )
    }
    getArrayOfMembersId() {
        let arrayOfMembers = this.#guild.members.cache.toJSON()
        let arrayOfMembersWithoutBots = arrayOfMembers.filter( (member) => !member.user.bot )
        let arrayOfMembersId = arrayOfMembersWithoutBots.map( (member) => member.id )
        return arrayOfMembersId
    }
}


class WrapperMember {
    
        #id
        #wrapperGuild

    setId( id ) {
        this.#id = id
    }
    setWrapperGuild( wrapperGuild ) {
        this.#wrapperGuild = wrapperGuild
    }
    setRole( roleName ) {
        this.#wrapperGuild.setRoleToMember( this.#id, roleName )
    }
    deleteRole( roleName ) {
        this.#wrapperGuild.deleteRoleOfMember( this.#id, roleName )
    }
    setSubstring( substring ) {
        this.#wrapperGuild.setSubstringToMember( this.#id, substring )
    }
    writeToMember( text ) {
        this.#wrapperGuild.writeToMember( this.#id, text )
    }
}


class WrapperRolesOfGuild {

        #guild
        #listOfRoles
        #jsonRASOfRolesInGuild

    getRole( role ) {
        this.#jsonRASOfRolesInGuild.selectKey( role )
        let id = this.#jsonRASOfRolesInGuild.getValue( "id" )
        let guildRole = this.#guild.roles.cache.get( id )
        return guildRole
    }

    setGuild( guild ) {
        this.#guild = guild
    }
    setListOfRoles( list ) {
        this.#listOfRoles = list
        this.#createAllRolesInGuildIfDontExit()
    }
    #createAllRolesInGuildIfDontExit() {
        this.#createJsonFileRASOfRolesInGuild()
        this.#iterateAllRolesAndCreateIfDontExit()
    }
    #iterateAllRolesAndCreateIfDontExit() {
        for ( let role in this.#listOfRoles ) {
            if ( !this.#jsonRASOfRolesInGuild.isInclude( role ) ) {
                this.#createRole( role )
            }
        }
    }
    #createRole( role ) {
        let roleObj = this.#listOfRoles[ role ]
        let roleName = roleObj.name
        let roleColor = roleObj.color
        let wrapperRoles = this
        this.#guild.roles.create( {
            name: roleName,
            color: roleColor,
        }).then( ( guildRole ) => { wrapperRoles.registretGuildRole( guildRole, role ) } )
    }
    registretGuildRole( guildRole, role ) {
        let id = guildRole.id
        this.#jsonRASOfRolesInGuild.selectKey( role )
        this.#jsonRASOfRolesInGuild.setValue( "id", id )
    }
    #createJsonFileRASOfRolesInGuild() {
        let path = `./guildsInfo/guild_${this.#guild.id}/rolesInGuild.json`
        this.#jsonRASOfRolesInGuild = new JsonFileReaderAndSync()
        this.#jsonRASOfRolesInGuild.setPath( path )
    }
}

module.exports = { WrapperClient, WrapperGuild }