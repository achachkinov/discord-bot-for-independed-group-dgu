const { JsonFileReaderAndSync } = require("./jsonFileReaderAndSync.js")
const { WrapperClient } = require("./wrapperDiscrod.js")
const listOfMedalsJson = require("./listOfMedals.json")


class GuildsReatingOfMembers {

        #guildsCollection = {}

    getGuildMembersReating( idGuild ) {
        try {
            this.#createGuildMembersReatingIfDontExit( idGuild )
            return this.#guildsCollection[ idGuild ]
        } catch ( e ) {
            console.log( e )
        }
    }
    #createGuildMembersReatingIfDontExit( id ) {
        if ( !(id in this.#guildsCollection) ) {
            this.#createGuildMembersReating( id )
        } 
    }
    #createGuildMembersReating( id ) {
        let guildMembersReating = new GuildMembersRatingCollection()
        guildMembersReating.setGuildId( id )
        this.#guildsCollection[ id ] = guildMembersReating
    }
    setClient( client ) {
        let wrapperClient = WrapperClient.getSingleton()
        wrapperClient.setClient( client )
        wrapperClient.setListOfRoles( listOfMedalsJson )
        this.#createGuildsReatingList( client )
    }
    #createGuildsReatingList( client ) {
        let listOfGuilds = client.guilds.cache.toJSON()
        for ( let guild of listOfGuilds ) {
            let guildId = guild.id
            this.#createGuildMembersReating( guildId )
        }
    }

    static getSingleton() {
        return GuildsReatingOfMembers.prototype.singleton
    }
}
GuildsReatingOfMembers.prototype.singleton = new GuildsReatingOfMembers()



class GuildMembersRatingCollection {

        #membersCollection = {}
        #guildId
        #jsonFileReaderAndSyncOfReating
        #wrapperGuild

    getMemberRatingById( id ) {
        this.#createMemberRatingIfDontExit( id )
        return this.#membersCollection[ id ]
    }
    #createMemberRatingIfDontExit( id ) {
        if ( ! (id in this.#membersCollection) ) {
            this.#createNewMemberRating( id )
        }
    }
    #createNewMemberRating( id ) {
        let memberRating = new MemberRating()
        let levelCounter = new ClassicLevelCounter()
        let wrapperMember = this.#wrapperGuild.getWrapperMember( id )
        memberRating.setMemberId( id )
        memberRating.setLevelCounter( levelCounter )
        memberRating.setJsonFileReaderAndSyncOfReating( this.#jsonFileReaderAndSyncOfReating )
        memberRating.setWrapperMember( wrapperMember )
        memberRating.syncState()
        this.#membersCollection[ id ] = memberRating
    }

    setGuildId( id ) {
        this.#guildId = id
        this.#createJsonFileRASOfReating()
        let singleton = WrapperClient.getSingleton()
        this.#wrapperGuild = singleton.getWrapperGuildById( id )
        this.#createAllMemberRating()
    }
    #createJsonFileRASOfReating() {
        let path = `./guildsInfo/guild_${ this.#guildId }/reatingOfMembers.json`
        this.#jsonFileReaderAndSyncOfReating = new JsonFileReaderAndSync()
        this.#jsonFileReaderAndSyncOfReating.setPath( path )
    }
    #createAllMemberRating() {
        let arrayOfMembersId = this.#wrapperGuild.getArrayOfMembersId()
        for ( let memberId of arrayOfMembersId ) {
            this.#createNewMemberRating( memberId ) 
        }
    }
    getGuildId() {
        return this.#guildId
    }
}




class MemberRating {///////////////

        #memberId

        #oldLevelInfo

        #ratingMemberInfo = new RatingMemberInfo()
        #memberWrapper

    syncState() {
        this.#updateSubstringOfLevelInformation()
    }
    awardMedal( medalName ) {
        if ( this.#ratingMemberInfo.isCanAwardAMedal( medalName ) ) {
            this.#ratingMemberInfo.awardMedal( medalName )
            this.#awardMedalToMemberDecor( medalName )
            this.#reportAboutAwardAMedal( medalName )
            this.#reportIfLevelChanged()
        }
    }

    #awardMedalToMemberDecor( medalName ) {
        this.#updateSubstringOfLevelInformation()
        this.#memberWrapper.setRole( medalName )
    }
    #reportAboutAwardAMedal( medal ) {
        let medalName = medalsCollection.getName( medal )
        let medalPoints = medalsCollection.getPointsCostOfMedal( medal )
        let text = ` congratulations, you got a \'${ medalName }\' medal, and +${ medalPoints } points. your points on level is ${ this.getPointsOnLevel() }`
        this.#memberWrapper.writeToMember( text )
    }

    deleteMedal( medalName ) {
        if ( this.includeMedal( medalName ) ){
            this.#ratingMemberInfo.deleteMedal( medalName )
            this.#deleteMedalInMemberDecor( medalName )
            this.#reportAboutDeletedMedal( medalName )
            this.#reportIfLevelChanged()
        } else {
            console.log( medalName + " Don't exist" )
        }
    }
    #reportAboutDeletedMedal( medal ) {
        let medalName = medalsCollection.getName( medal )
        let medalPoints = medalsCollection.getPointsCostOfMedal( medal )
        let text = ` лох, you lost a \'${ medalName }\' medal, and got -${ medalPoints } points. your points on level is ${ this.getPointsOnLevel() }`
        this.#memberWrapper.writeToMember( text )
    }
    #deleteMedalInMemberDecor( medalName ) {
        this.#updateSubstringOfLevelInformation()
        this.#memberWrapper.deleteRole( medalName )
    }
    #updateSubstringOfLevelInformation() {
        let substringOfLevelInfromation = ` [ lvl ${ this.getLevel() }  ]` 
        this.#memberWrapper.setSubstring( substringOfLevelInfromation )
    }

    addPoint() {
        this.#ratingMemberInfo.addPoints( 1 )
    }
    subtractPoints( number ) {
        this.#ratingMemberInfo.addPoints( -number )
    }
    addPoints( number ) {
        this.#ratingMemberInfo.addPoints( number )
    }

    #reportIfLevelChanged() {
        let level = this.#ratingMemberInfo.getLevel()
        if ( level != this.#oldLevelInfo ) {
            if ( level > this.#oldLevelInfo ) {
                this.#reportAboutRasingLevel()
            } else if ( level < this.#oldLevelInfo ) {
                this.#reportAboutFallingLevel()
            }
            this.#oldLevelInfo = level
        } 
    }
    #reportAboutRasingLevel() {
        let text = `congratulations, you got a ${ this.getLevel()} level. you got ${ this.getPointsOnLevel() } on level, and you have ${ this.getPointsForCompleteLevel() } points left until you reach a new level`
        this.#memberWrapper.writeToMember( text )
    }
    #reportAboutFallingLevel() {
        let text = ` лох, you lost a level, you got a ${ this.getLevel() } level. you got ${ this.getPointsOnLevel() } on level, and you have ${ this.getPointsForCompleteLevel() } points left until you reach a new level`
        this.#memberWrapper.writeToMember( text )
    }

    getIndicator( key ) {
        return this.#ratingMemberInfo.getIndicator( key )
    }
    setIndicator( key, value ) {
        this.#ratingMemberInfo.setIndicator( key, value )
    }

    getPoints() {
        return this.#ratingMemberInfo.getPoints()
    }
    getLevel() {
        return this.#ratingMemberInfo.getLevel()
    }
    getPointsOnLevel() {
        return this.#ratingMemberInfo.getPointsOnLevel()
    }
    getPointsForCompleteLevel() {
        return this.#ratingMemberInfo.getPointsForCompleteLevel()
    }
    getId() {
        return this.#memberId
    }

    setWrapperMember( wrapperMember ) {
        this.#memberWrapper = wrapperMember
    }
    setMemberId( id ) {
        this.#memberId = id
        this.#ratingMemberInfo.setMemberId( id )
    }
    setLevelCounter( levelCounter ) {
        this.#ratingMemberInfo.setLevelCounter( levelCounter )
    }
    setJsonFileReaderAndSyncOfReating( fileReaderAndSync ) {
        this.#ratingMemberInfo.setJsonFileReaderAndSyncOfReating( fileReaderAndSync )
        this.#oldLevelInfo = this.#ratingMemberInfo.getLevel()
    }
}



class RatingMemberInfo {

        #memberId

        #pointsForCompleteLevel = 0 

        #levelCounter
        #jsonFileRASOfReating

    awardMedal( medalName ) {
        let medals = this.getMedals()
        let medalPoints = medalsCollection.getPointsCostOfMedal( medalName )
        this.addPoints( medalPoints )
        medals.push( medalName )
        this.setMedals( medals )
    }

    isCanAwardAMedal( medalName ) {
        if ( medalsCollection.has( medalName ) ){
            if ( !this.#includeMedal( medalName ) ) {
                return true
            }
        }
        return false
    }


    deleteMedal( medalName ) {
        let medals = this.getMedals()
        /////////////////////////////////////////////////////
        this.setMedals( medals )
    }

    IsCanDeleteAMedal( medalName ) {
        return this.#includeMedal( medalName )
    }
    #includeMedal( medalName ) {
        let medals = this.getMedals()
        let result = medals.reduce( ( value, element ) => {
            if ( !value ) {
                value = element == medalName
            }
            return value
        }, false)
        return result
    }


    addPoints( number ) {
        let points = this.getPoints()
        let pointsOnLevel = this.getPointsOnLevel()
        points += number
        pointsOnLevel += number
        this.setPoints( points )
        this.setPointsOnLevel( pointsOnLevel )
        this.#updateStatistic()
    }
    #updateStatistic() {
        let pointsOnLevel = this.getPointsOnLevel()
        if ( pointsOnLevel >= this.#pointsForCompleteLevel ) {
            this.#levelUp()
        } else if ( pointsOnLevel < 0 ) {
            this.#levelDown()
        }
    }
    #levelUp() {
        let level = this.getLevel()
        let pointsOnLevel = this.getPointsOnLevel()
        level += 1
        pointsOnLevel -= this.#pointsForCompleteLevel
        this.setLevel( level )
        this.setPointsOnLevel( pointsOnLevel )
        this.#updatePointsForCompleteLevel()
        this.#updateStatistic()
    }
    #levelDown() {
        let level = this.getLevel()
        level -= 1
        this.setLevel( level )
        this.#updatePointsForCompleteLevel()
        let pointsOnLevel = this.getPointsOnLevel()
        pointsOnLevel += this.#pointsForCompleteLevel
        this.setPointsOnLevel( pointsOnLevel )
        this.#updateStatistic()
    }
    #updatePointsForCompleteLevel() {
        this.#pointsForCompleteLevel = this.#levelCounter.getPointsToCompleteLevel( this.getLevel() )
    }

    getPoints() {
        let valueType = "points"
        let value = this.#getValue( valueType )
        return value ? value : 0
    }
    getLevel() {
        let valueType = "level"
        let value = this.#getValue( valueType )
        return value ? value : 0
    }
    getPointsOnLevel() {
        let valueType = "pointsOnLevel"
        let value = this.#getValue( valueType )
        return value ? value : 0
    }
    getMedals() {
        let valueType = "medals"
        let value = this.#getValue( valueType )
        return value ? value : []
    }
    #getValue( valueType ) {
        this.#jsonFileRASOfReating.selectKey( this.#memberId )
        return this.#jsonFileRASOfReating.getValue( valueType )
    }
    getPointsForCompleteLevel() {
        return this.#pointsForCompleteLevel
    }

    setPoints( value ) {
        let valueType = "points"
        this.#setValue( valueType, value )
    }
    setLevel( value ) {
        let valueType = "level"
        this.#setValue( valueType, value )
    }
    setPointsOnLevel( value ) {
        let valueType = "pointsOnLevel"
        this.#setValue( valueType, value )
    }
    setMedals( value ) {
        let valueType = "medals"
        this.#setValue( valueType, value )
    }
    #setValue( valueType, value ) {
        this.#jsonFileRASOfReating.selectKey( this.#memberId )
        this.#jsonFileRASOfReating.setValue( valueType, value )
    }

    getIndicator( key ) {
        this.#jsonFileRASOfReating.selectKey( "indicators" )
        let value = this.#jsonFileRASOfReating.getValue( key ) ?? 0 
        return value
    }
    setIndicator( key, value ) {
        this.#jsonFileRASOfReating.selectKey( "indicators" )
        this.#jsonFileRASOfReating.setValue( key, value )
    }

    setMemberId( id ) {
        this.#memberId = id
    }
    setLevelCounter( levelCounter ) {
        this.#levelCounter = levelCounter
    }
    setJsonFileReaderAndSyncOfReating( fileReaderAndSync ) {
        this.#jsonFileRASOfReating = fileReaderAndSync
        this.#updatePointsForCompleteLevel()
    }
}



class ClassicLevelCounter {

        #firstLevelPoints = 10

    getPointsToCompleteLevel( level ) {
        return Math.pow( 2, level )*this.#firstLevelPoints
    }
}



class MedalCollection {

        #listOfMedal

    has( medalName ) {////////////
        return (medalName in this.#listOfMedal)
    }
    getPointsCostOfMedal( medalName ) {
        return this.#listOfMedal[ medalName ].points
    }
    getName( medal ) {
        return this.#listOfMedal[ medal ].name
    }

    setList( list ) {
        this.#listOfMedal = list
    }
}

const medalsCollection = new MedalCollection()
medalsCollection.setList( listOfMedalsJson )


module.exports = { GuildsReatingOfMembers }