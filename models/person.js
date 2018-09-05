const mongoose = require('mongoose')

const url = 'mongodb://user:pass@ds243502.mlab.com:43502/persons'

const options = { useNewUrlParser: true }

mongoose.connect(url, options)

const PersonSchema = new mongoose.Schema({
    name: String
  , number: String
});

PersonSchema.statics.format = function (person) {
  return {
    name: person.name,
    number: person.number,
    id: person.id
  }
}

const Person = mongoose.model('Person', PersonSchema)

module.exports = Person
