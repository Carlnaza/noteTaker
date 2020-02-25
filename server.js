const express = require('express')
const { join } = require('path')
const fs = require('fs')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(join(__dirname, 'public')))

app.get('/notes', (req, res) => {
  res.sendFile(join(__dirname, 'public/notes.html'))
})



app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (e, notes) => {
    if (e) { console.log(e) }
    
    res.json(JSON.parse(notes))
  })
})

app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (e, note) => {
    if (e) { console.log(e) }

    const notes = JSON.parse(note)

    notes.push(req.body)

    fs.writeFile('./db/db.json', JSON.stringify(notes), e => {
      if (e) { console.log(e) }
      res.sendStatus(200)
    })
  })
})

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (e, data) => {
    if (e) { console.log(e) }

    const notes = JSON.parse(data)
    
    for(let i = 0; i < notes.length; i++){
     if(notes[i].title === req.params.id){
       notes.splice(i, 1)
     }
    }
   
    fs.writeFile('./db/db.json', JSON.stringify(notes), e => {
      if (e) { console.log(e) }
      res.sendStatus(200)
    })
  })
})



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))