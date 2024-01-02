const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) =>
  Note.find({}).then(notes => response.json(notes))
)

notesRouter.get('/:id', (request, response, next) =>
  Note.findById(request.params.id)
    .then(note =>
      note
        ? response.json(note)
        : response.status(404).end() // handle if no res. with such `id` is found
    )
    .catch(error => {
      // handle if `id` is not in MongoDB `id` format
      next(error) // `next(...)` will pass execution to `error handler middleware`
    })
)

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save()
    .then(savedNote => response.json(savedNote))
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) =>
  Note.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
)

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