function updateMemberRole( dataBase  ) {
    if ( dataBase.isModified( "enable" ) ) {
        const originalStatement = dataBase.getUpdate ? dataBase.getUpdate().enable : dataBase.enable; 
        const modifiedStatement = dataBase.enable;
        if ( modifiedStatement != originalStatement ) {
            if ( dataBase.enable ) {
                //
            } else {
                //
            }
        }
    }
}



module.exports = { updateMemberRole }