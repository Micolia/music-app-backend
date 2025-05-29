import express from 'express'
import 'dotenv/config'
import fs from 'fs'
import path from 'path' // collegare frontend P1

const app = express() // crear servidor

const PORT = process.env.PORT ?? 3000 // se non ha variabile levanta 3000
console.log(process.env.PORT)

app.get('/', (req, res) => {
  const filePath = path.resolve('public/index.html')
  res.sendFile(filePath)
}) // collegare frontend P2

app.use(express.json()) // middelware - tutto quello che sta sotto è json
// app.use(express.static('public')) // connetti a frontend ALTERNATIVA public/index.html

function leerCanciones () {
  try {
    const data = fs.readFileSync('./data/canciones.json', 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function guardarCanciones (canciones) {
  fs.writeFileSync('./data/canciones.json', JSON.stringify(canciones, null, 2))
}

// GET
app.get('/canciones', (req, res) => {
  const canciones = leerCanciones()
  res.json(canciones)
})

// POST
app.post('/canciones', (req, res) => {
  const canciones = leerCanciones()
  const nuevaCancion = {
    id: req.body.id || Date.now(), // crea el id
    titulo: req.body.titulo,
    artista: req.body.artista,
    tono: req.body.tono
  }
  canciones.push(nuevaCancion)
  guardarCanciones(canciones)
  res.status(201).json(nuevaCancion)
})

// PUT
app.put('/canciones/:id', (req, res) => {
  const id = Number(req.params.id)
  const canciones = leerCanciones()
  const index = canciones.findIndex(c => c.id === id)
  if (index !== -1) {
    canciones[index] = {
      id,
      titulo: req.body.titulo,
      artista: req.body.artista,
      tono: req.body.tono
    }
    guardarCanciones(canciones)
    res.sendStatus(200)
  } else {
    res.status(404).json({ error: 'Canción no encontrada' })
  }
})

// DELETE
app.delete('/canciones/:id', (req, res) => {
  const id = Number(req.params.id)
  const canciones = leerCanciones()
  const nuevasCanciones = canciones.filter(c => c.id !== id)
  if (nuevasCanciones.length === canciones.length) {
    return res.status(404).json({ error: 'Canción no encontrada' })
  }
  guardarCanciones(nuevasCanciones)
  res.sendStatus(200)
})

app.listen(PORT, console.log(`Server: http://localhost:${PORT}`)) // levanta servidor
