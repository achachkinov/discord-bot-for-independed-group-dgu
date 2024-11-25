const { readFileSync, writeFileSync } = require('fs');

class JsonFileReaderAndSync {
    #json = {};
    #pathJsonFile = '';
    #selectedKey = '';

    constructor(path) {
        this.setPath(path);
    }

    getValueBySecondKey(secondKey) {
        return this.#json[this.#selectedKey]?.[secondKey];
    }

    setValue(secondKey, value) {
        if (!this.#json[this.#selectedKey]) {
            this.#json[this.#selectedKey] = {};
        }
        this.#json[this.#selectedKey][secondKey] = value;
        this.#save();
    }

    #save() {
        writeFileSync(this.#pathJsonFile, JSON.stringify(this.#json, null, 2), 'utf8');
    }

    selectKey(key) {
        this.#selectedKey = key;
    }

    keyExists(key) {
        return key in this.#json;
    }

    setPath(path) {
        this.#pathJsonFile = path;
        try {
            const json = readFileSync(this.#pathJsonFile, 'utf8');
            this.#json = JSON.parse(json);
        } catch (error) {
            console.error('Error reading or parsing JSON file:', error);
            this.#json = {};
            this.#save();
        }
    }
}

module.exports = { JsonFileReaderAndSync };