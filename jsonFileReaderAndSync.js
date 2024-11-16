const { readFileSync, writeFileSync } = require('fs');
//shiiiiii

class JsonFileReaderAndSync {

        #json
        #pathJsonFile

        #selectedKey

    getValue( secondKey ) {
        if ( this.#json[ this.#selectedKey ] ) {
            if ( this.#json[ this.#selectedKey ][ secondKey ] ) {
                return this.#json[ this.#selectedKey ][ secondKey ]
            }
        }
        return undefined
    }

    setValue( secondKey, value ) {
        if ( !this.#json[ this.#selectedKey ] ) {
            this.#json[ this.#selectedKey ] = {}
        }
        this.#json[ this.#selectedKey ][ secondKey ] = value
        this.#save()
    }
    #save() {
        let json = JSON.stringify( this.#json );
        writeFileSync( this.#pathJsonFile, json );
    }

    selectKey( key ) {
        this.#selectedKey = key
    }

    isInclude( key ) {
        return key in this.#json
    }


    setPath( path ) {
        this.#pathJsonFile = path
        try {
            let json = readFileSync( this.#pathJsonFile , 'utf8' );
            this.#json = JSON.parse(json);
        } catch {
            this.#json = {}
            let jsonStringify = JSON.stringify( this.#json );
            writeFileSync( this.#pathJsonFile, jsonStringify, 'utf8' );
        }
    }
}

module.exports = { JsonFileReaderAndSync }