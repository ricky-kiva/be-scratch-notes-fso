const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

const Note = require('./models/note')

const app = express()

morgan.token('post-body', (request, _response) => {
  if (request.method === 'POST' && request.body) {
    return JSON.stringify(request.body)
  }
  return ' '
})

app.use(express.json()) // impl. json-parser on Express
app.use(cors())
app.use(express.static('dist')) // make Express show static content from `dist` dir.
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))

/* Overridden by Morgan
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
} */

// app.use(requestLogger) // impl. custom middleware

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id

  Note.findById(id)
    .then(note => 
      note 
        ? response.json(note) 
        : response.status(404).end() // handle if no res. with such `id` is found
    )
    .catch(error => {
      // handle if `id` is not in MongoDB `id` format
      next(error) // `next(...)` will pass execution to `error handler middleware`
    })
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ 
      status: 'error',
      message: 'content missing' 
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save()
    .then(savedNote => { response.json(savedNote) })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
    
  Note.findByIdAndDelete(id)
    .then(_result => response.status(204).end())
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body
  const id = request.params.id

  const note = {
    content: body.content,
    important: body.important
  }

  // `new: true` will return updated doc.
  // `runValidators: true` will apply validator stated on schema on PUT
  // `context: query` need to also be set along with `runValidators: true` for some technical reasons
  Note.findByIdAndUpdate(
    id, note, { new: true, runValidators: true, context: 'query' }
  ) 
    .then(updatedNote => response.json(updatedNote))
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) =>
  response.status(404).send({
    status: 'error', 
    message: 'Unknown Endpoint'
  })

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ 
      status: 'error',
      error: 'malformatted id' 
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      status: 'error',
      error: error.message
    })
  }

  next(error)
}

app.use(unknownEndpoint) // impl. custom middleware
app.use(errorHandler) // impl. err. handler

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})