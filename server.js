const express = require("express");
const path = require("path");
const fs = require("fs").promises; // Allow for async/await
const uid = require("uid");

const UID_LENGTH = 16;
const PORT = process.env.PORT || 3001;

const app = express();

let dbData; // Will contain the data from db.json

app.use(express.json()); // Needed for header 'Content-Type': 'application/json'
app.use(express.urlencoded({ extended: true }));
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
        "title": title,
        "text": text,
        "id": uid.uid(UID_LENGTH), // Add a new unique id to each new note
    }

    let dbData = JSON.parse(await getDbData()); // Get most updated file data
    dbData.push(newNote); // Add new note to json array

    try {
        await fs.writeFile("./db/db.json", JSON.stringify(dbData, null, 4));
        // console.log("added note");
        res.send(dbData);
    } catch (error) {
        console.error(error)
        res.sendStatus(500);
    }
});


app.delete("/api/notes/:id", async (req, res) => {
    const idToDelete = req.params.id;

    if (idToDelete) {
        let dbData = JSON.parse(await getDbData()); // Get most updated file data
        
        // Find the id in the json file and delete the corresponding note
        for (let i = 0; i < dbData.length; i++) {
            if (dbData[i].id === idToDelete) {
                dbData.splice(i, 1);
            }
        }

        try {
            await fs.writeFile("./db/db.json", JSON.stringify(dbData, null, 4));
            // console.log("deleted note");
            res.send(dbData);
        } catch (error) {
            console.error(error)
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(500);
    }
});


app.listen(PORT, async () => {
    console.log(`Listening at http://localhost:${PORT}`);
});


/**
 * Async function to get the data from db.json.
 * This will be called to get the most updated version of the file's data.
 * @returns Object containing the .json file's data
 */
async function getDbData() {
    try {
        const data = await fs.readFile("./db/db.json", "utf8");
        return data;
    } catch (error) {
        console.error(error);
    }

    return ;
}