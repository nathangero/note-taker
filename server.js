const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./db/db.json");

const PORT = 3001;

const app = express();

let dbData; // Will contain the data from db.json

app.use(express.json()); // Needed for header 'Content-Type': 'application/json'
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
})

app.get("/api/notes", (req, res) => {
    res.send(db);
})

// Saving a note
app.post("/api/notes", (req, res) => {
    const body = req.body;
    const title = body.title;
    const text = body.text;

    let note = {
        title: title,
        text: text
    }

    dbData.push(note);

    fs.writeFile("./db/db.json", JSON.stringify(dbData, null, 4), (err) => {
        err ? console.error(err) : console.log("added new note");
        
        // Send the note data regardless
        res.send(db);
    })
})


app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)

    // Read in json data when server starts
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return
        }

        dbData = JSON.parse(data);
    })
})