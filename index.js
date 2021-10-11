const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.json())

const morgan = require('morgan')
const morganFormat = ":method :url :status :res[content-length] - :response-time ms"
morgan.token('body',(req) => JSON.stringify(req.body))
app.use(morgan(`${morganFormat} :body`))
app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    const totalPersons = persons.length
    const date = new Date()
    res.send(`
    <p>Phonbook has info for ${totalPersons}</p>
    <p>${date}</p>
    `)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
      res.json(person)
  } else{
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  const existing = persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())


  if (!body.name || !body.number){
    return res.status(400).json({error: 'content missing'})
  } 
  else if(existing){
    return res.status(400).json({error: 'name must be unique'})
  }

  const person = {
    id: Number(Math.random()),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})