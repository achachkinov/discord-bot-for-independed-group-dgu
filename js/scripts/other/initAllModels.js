const fs = require('node:fs');
const path = require('node:path');

const mongoose = require("mongoose")

function initAllModels() {
    const parentDir = path.join(__dirname, '../../');
    const foldersPath = path.join(parentDir, 'schemes');
    const schemeFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));
    for (const file of schemeFiles) {
        const filePath = path.join(foldersPath, file);
        const scheme = require(filePath);
        const key = Object.keys(scheme)[0]
        const nameModel = createNameModel(key)
        global[nameModel] = mongoose.model(nameModel, scheme[key])
    }

    function createNameModel(key) {
        const postscript = "Schema"
        const endKeyWithoutPostscript = key.length - postscript.length
        key = key.substring(0, endKeyWithoutPostscript)
        key = key.charAt(0).toUpperCase() + key.slice(1);
        return key
    }
}
module.exports = { initAllModels }