const mongoose = require('mongoose')

const entrySchema = mongoose.Schema({
    description: {type: String, required: true},
    entryDate: {type: String, required: true}
})

const entryModel = mongoose.model('Entry', entrySchema)

module.exports = entryModel