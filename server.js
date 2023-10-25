const express = require("express");
const path = require("path");
const dbData = require("./db/db.json");

const PORT = 3001;

const app = express();

app.use(express.json()); // Needed for header 'Content-Type': 'application/json'
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
})

app.get("/api/notes", (req, res) => {
    res.send(dbData);
})

// Saving a note
app.post("/api/notes", (req, res) => {
    const body = req.body;
    console.log("body:", body);
})


app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})