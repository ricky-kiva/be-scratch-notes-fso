const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

const api = supertest(app)

beforeEach(async () => {
  await Note.deleteMany({})
  initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
  })
})

// run with `npm run test -- --test-only`
test.only('notes returns json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('there are 2 notes', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, initialNotes.length)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(e => e.content)

  assert(contents.includes('HTML is easy')) // if it's truthy
})

after(async () => { await mongoose.connection.close() })