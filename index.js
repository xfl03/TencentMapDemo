require('dotenv').config()
const express = require('express')
require('express-async-errors')
const {parseRawFile} = require("./lib/bus-routing");
const {getRouters} = require("./lib/direction-driving-api");
const app = express()
const port = 3030

async function init() {
    if (process.argv.length > 2) {
        await parseRawFile(process.argv[2]);
    }
}

async function startExpress() {
    app.use(express.json())
    app.use(express.static('public'));

    app.post('/api/route', async (req, res) => {
        res.json(await getRouters(req.body))
    })

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`)
    })
}

init().then(startExpress)
// startExpress();