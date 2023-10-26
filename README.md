# Note Taker

## Description

This website allows anyone to create, view, and delete notes.

The purpose for this website was to practice reading and writing to a file via `node.js`, and deploying it to a backend service like [Heroku](https://www.heroku.com/). The "database" for this application is a simple `.json` file. 

Since this website doesn't use any features like a User Login/Signup, all the notes are whatever people put in. So, if I create a note then everyone else will see it, and the same goes if I delete a note.

Deployment link: [https://note-taker-nathangero-9af003f4c921.herokuapp.com](https://note-taker-nathangero-9af003f4c921.herokuapp.com)

### How it works

The front end calls `fetch()` to access an API endpoint in the `server.js` file. Then, once the request is processed (reading/writing to the `.json` file), it updates the webpage to show the newly created/deleted note.

## Learning Points

* Learning to work with `fetch()` requests to a node server was pretty fun! I have experience using RESTful API services before like with PayPal, so it's cool to kind of see how these REST API services are designed and created.
* Using async/await for file reading/writing does help make the code a lot more readable. Having to nest callback functions would not be as clear to read and understand.
* Deploying to Heroku was very simple after setting up my account. It makes it easy to connect to the GitHub repo and deploy the code!
* Using unique IDs like `UUID` is very useful for identifying content in the database file. It made finding which note to delete very easy. You can find a [code snippet](#code-snippets) of it below of how it was used.

## Usage

Simply visit the website listed at the bottom of [Description](#description), enter a new note of your choice on the right-hand column, view created notes on the left-hand column, or delete notes found in the left-hand column.


## Code Snippets

Using async/await to read in the db.json
```js
async function getDbData() {
    try {
        const data = await fs.readFile("./db/db.json", "utf8");
        return data;
    } catch (error) {
        console.error(error);
    }

    return ;
}
```

Saving a new note. 
```js
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
    res.send(dbData); // Return the updated note data
} catch (error) {
    console.error(error)
    res.sendStatus(500);
}
```


Using UUIDs to delete a specific note and still maintain the same note order
```js
for (let i = 0; i < dbData.length; i++) {
    if (dbData[i].id === idToDelete) {
        dbData.splice(i, 1);
    }
}
```

## Images

Image of the website

<img src="./public/assets/images/website.PNG" width="600px" height="auto" alt="Image of the website showing a selected note on the right and previous notes on the left.">

## Credits


### Resources

[fs.promsies](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_promises_api)

[uid node package](https://www.npmjs.com/package/uid)

[Deploy to Heroku](https://devcenter.heroku.com/articles/git)