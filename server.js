const express = require("express");
const path = require("path");
const fs = require("fs").promises; // Allow for async/await

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

app.get("/api/notes", async (req, res) => {
    res.send(await getDbData()); // Always get the most updated file data
})

// Saving a note
app.post("/api/notes", async (req, res) => {
    const body = req.body;
    const title = body.title;
    const text = body.text;

    // Create new note object
    let newNote = {
        title: title,
        text: text
    }

    let dbData = JSON.parse(await getDbData()); // Get most updated file data
    dbData.push(newNote); // Add new note to json array

    const err = await fs.writeFile("./db/db.json", JSON.stringify(dbData, null, 4));
    err ? console.error(err) : console.log("added new note");
    res.send(dbData);
})


app.listen(PORT, async () => {
    console.log(`Listening at http://localhost:${PORT}`);
})


/**
 * Async function to get the data from db.json.
 * This will be called to get the most updated version of the file's data.
 * @returns Object containing the .json file's data
 */
async function getDbData() {
    const data = await fs.readFile("./db/db.json", "utf8");
    return data;
}