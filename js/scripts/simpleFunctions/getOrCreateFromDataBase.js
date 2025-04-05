async function getOrCreateFromDataBase( DataBase, parameters ) {
    let dataBase = await DataBase.findOne(parameters) 
    if ( !dataBase ) {
        dataBase = new DataBase( parameters ) 
    }
    return dataBase
}

module.exports = { getOrCreateFromDataBase }

