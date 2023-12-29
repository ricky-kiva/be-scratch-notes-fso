const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false) // allow querying without strictly follow Schema

console.log('connecting to', url)
mongoose.connect(url)
    .then(result => console.log('connected to MongoDB'))
    .catch((error) => console.log('error connecting to MongoDB', error.message))

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
})

// modify the `toJSON` method of the schema (applied when retrieving data from MongoDB)
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// if the first param is `Note` (singular), then Mongoose will automatically set the collection name to `notes` (plural)
module.exports = mongoose.model('Note', noteSchema)