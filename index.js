const express = require('express'),
  morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))

app.use(bodyParser.json())

morgan.token('data', function getData(res) {
    return (JSON.stringify(res.body))
});

const loggerFormat = ':method :url :data :status :res[content-length] :response-time ms';


app.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode < 400
    }, stream: process.stderr
}));

app.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode >= 400
    }, stream: process.stdout
}));

let persons = [
   {
      "name": "Arto Hellas",
      "number": "040-12345",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    }
]

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'no data found' })
    })
})

app.get('/info', (request, response) => {
  Person
    .find({})
    .then(persons => {
      persons.map(Person.format)
      const amount = persons.length
      const date = new Date()
      const responseMessage =  `puhelinluettelossa on ${amount} henkilön tiedot, ${date}`
      response.send(responseMessage)
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'no data found' })
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

const generateId = () => {
  const min = persons.length
  const max = 100;
  const rand =  min + (Math.random() * (max-min));
  return Math.floor(rand);
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    if (body.name === undefined) {
      return response.status(400).json({error: 'name missing'})
    } else {
      return response.status(400).json({error: 'number missing'})
    }
  }

  if (persons.some(person => (person.name === body.name))) {
    return response.status(400).json({error: 'name must be unique'})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId()
  })

  person
    .save()
    .then(savedPerson => {
      response.json(Person.format(savedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: '' })
    })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    if (body.name === undefined) {
      return response.status(400).json({error: 'name missing'})
    } else {
      return response.status(400).json({error: 'number missing'})
    }
  }

  const person = {id: request.params.id}
  person.name = body.name
  person.number = body.number
  Person.findByIdAndUpdate(request.params.id, person)
  .then(updatedPerson => {
    response.json(Person.format(updatedPerson))
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
