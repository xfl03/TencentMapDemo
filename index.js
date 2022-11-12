require('dotenv').config()
const express = require('express')
require('express-async-errors')
const {parseRawFile} = require("./lib/bus-routing");
const app = express()
const port = 3000

async function init() {
    if (process.argv.length > 2) {
        await parseRawFile(process.argv[2]);
    }
}

async function startExpress() {
    app.use(express.static('public'));

    app.get('/api/start', async (req, res) => {
        res.send("HW")
    })

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`)
    })
}

init().then(startExpress)