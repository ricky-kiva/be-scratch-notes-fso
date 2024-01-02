const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
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