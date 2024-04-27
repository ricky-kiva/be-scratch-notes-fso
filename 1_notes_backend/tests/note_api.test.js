const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./test_helper')
const Note = require('../models/note')

const api = supertest(app)

beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()
  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
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

  assert.strictEqual(response.body.length, helper.initialNotes.length)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(e => e.content)

  assert(contents.includes('HTML is easy')) // if it's truthy
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAfter = await helper.notesInDb()
  assert.strictEqual(notesAfter.length, helper.initialNotes.length + 1)

  const contents = notesAfter.map(n => n.content)
  assert(contents.includes('async/await simplifies making async calls'))
})

test('note without content won\'t be added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAfter = await helper.notesInDb()

  assert.strictEqual(notesAfter.length, helper.initialNotes.length)
})

after(async () => { await mongoose.connection.close() })