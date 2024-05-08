const notesRouter = require('express').Router()

const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response) => {
  // equivalent to:
  // - Note.find({}).then(notes => response.json(notes))
  const notes = await Note.find({})
    .populate('user', {
      username: 1,
      name: 1,
    })

  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id
  })

  const savedNote = await note.save()

  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const id = request.params.id

  const note = {
    content: body.content,
    important: body.important
  }

  // `new: true` will return updated doc.
  // `runValidators: true` will apply validator stated on schema on PUT
  // `context: query` need to also be set along with `runValidators: true` for some technical reasons
  Note.findByIdAndUpdate(id, note, { new: true })
    .then(updatedNote => response.json(updatedNote))
    .catch(error => next(error))
})

module.exports = notesRouter