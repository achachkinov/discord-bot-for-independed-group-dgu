function getPointsForMessage( message ) {
    let points = 1
    if ( message.channel.isThread() ) {
        points = 50
    }
    return points
}

module.exports = { getPointsForMessage }