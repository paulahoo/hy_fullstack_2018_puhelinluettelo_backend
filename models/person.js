const mongoose = require('mongoose')

if ( process.env.PERSON_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

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

/*PersonSchema.statics.updatePerson = function(person, cb) {
  Person.find({name : person.name}).exec(function(err, docs) {
    if (docs.length){
      cb('Name exists already', null);
    } else {
      person.save(function(err) {
        cb(err,user);
      }
    }
  })
})*/

const Person = mongoose.model('Person', PersonSchema)

module.exports = Person
