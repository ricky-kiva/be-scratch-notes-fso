const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const dbName = 'notes_app'

const url = `mongodb+srv://rickyslash-fso:${password}@cluster-notes-fso.sfkae7u.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.set('strictQuery', false) // allow querying without strictly follow Schema
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
})

// if the first param is `Note` (singular), then Mongoose will automatically set the collection name to `notes` (plural)
const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//     content: 'HTML is Easy',
//     important: true
// })

// note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close() // note: always close the connection after premise
// })

Note.find({}).then(result => {
    result.forEach(note => console.log(note))
    mongoose.connection.close()
})