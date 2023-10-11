const express = require('express');
const fs = require('fs');
const path = require('path');
const { notes } = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));


function generateUniqueId() {
    return ''+ Math.random().toString(36).substr(2,9);
}

function createNewNote (body, notesArray) {
    const note = body;
    notesArray.push(note);
    note.id = generateUniqueId();
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    req.body.id = generateUniqueId();
    const note = createNewNote(req.body, notes);
    res.json(note);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});