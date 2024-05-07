const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // check if DB is free from duplicates if set `unique` to true. Unless, it won't work
    // `autoindex` must be true when connecting to MongodB
    unique: true,
  },
  name: String,
  passwordHash: String,
  // taking ref. of `Notes` to be a part of `userSchema`'s array property
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash // retrieved JSON shouldn't contain the password
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User