const { createOrUpdateAccessToCategoryRole } = require('../scripts/other/preSaveCategoryIdDataBase')
const { deleteAccessToCategoryRole } = require('../scripts/other/preRemoveCategoryIdDataBase')
const mongoose = require("mongoose")

const categoryIdSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    categoryId: { type: String, required: true },
    emblem: { type: String, require: true},
    categoryName: { type: String, required: true },
    categoryColor: { type: String, required: true },
})

categoryIdSchema.pre('save', function (next) {
    createOrUpdateAccessToCategoryRole(this)
    next();
});

categoryIdSchema.pre("deleteOne", async function (next) {
    await deleteAccessToCategoryRole( this )
    next();
});


module.exports = { categoryIdSchema }