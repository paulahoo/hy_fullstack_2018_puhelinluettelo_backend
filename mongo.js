const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = 'mongodb://user:pwd@ds243502.mlab.com:43502/persons'
const options = { useNewUrlParser: true }

mongoose.connect(url, options)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv[2] != undefined && process.argv[3] != undefined ) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })
  person
    .save()
    .then(response => {
      console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
      mongoose.connection.close()
    })
} else {
  Person
    .find({})
    .then(result => {
      console.log("Puhelinluettelo:")
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}
