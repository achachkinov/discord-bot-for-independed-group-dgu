class CalculatorLevelOfMember {

    static getLevelByPoints( points ) {
        return CalculatorLevelOfMember.getLevel( points )
    }

    static getPointOnLevel( points ) {
        let level = CalculatorLevelOfMember.getLevel( points )
        let pointsOfLevel = CalculatorLevelOfMember.getPoints( level )
        let pointsOnLevel = points - pointsOfLevel
        return pointsOnLevel
    }
    static getPointsToNextLevel( points ) {
        let level = CalculatorLevelOfMember.getLevel( points )
        let pointsOfNextLevel = CalculatorLevelOfMember.getPoints( level + 1 )
        let pointsToNextLevel = pointsOfNextLevel - points
        return pointsToNextLevel
    }

    static getLevel( points ) {
        //hard formula
        let normalizePoints = (points*6)/CalculatorLevelOfMember.prototype.constant
        let intermediateValue = Math.pow( ( normalizePoints + Math.sqrt( normalizePoints*normalizePoints - 1/108 ) )/4, 1/3 )
        let notARoundedLevel = intermediateValue + 1/( 12*intermediateValue) -1/2
        let level = Math.floor( notARoundedLevel )
        return level
    }
    static getPoints( level ) {
        //hard formula
        let normalizePoints = level*(level+1)*(2*level+1)
        let points = (normalizePoints*CalculatorLevelOfMember.prototype.constant)/6
        return points
    }
}

CalculatorLevelOfMember.prototype.constant = 5

module.exports = { CalculatorLevelOfMember }