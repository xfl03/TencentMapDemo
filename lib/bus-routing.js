const {findBusStop, findMetroStop, findNearBusStop} = require("./place-search-api");
const {getRouters} = require("./direction-driving-api");
const {readFileSync, writeFileSync, copyFileSync} = require("fs")

async function parseRawFile(from) {
    copyFileSync(from, "public/root.json")
    let rawRoutes = JSON.parse(readFileSync(from));
    writeFileSync("public/route.json", JSON.stringify(await parseRoutes(rawRoutes)));
}

function checkContains(locations, latest) {
    for (let location of locations) {
        if (Math.abs(latest.lat - location.lat) < 1e-6 && Math.abs(latest.lng - location.lng) < 1e-6) {
            return true;
        }
    }
    return false;
}

async function parseRoutes(rawRoutes) {
    let locations = [];
    for (let route of rawRoutes) {
        let location = await findNearBusStop(route.center);
        if (location !== null) {
            if (checkContains(locations, location)) {
                continue;
            }
            locations.push(location);
        }
    }
    // let locations = rawRoutes.map(it=>it.center);
    writeFileSync("public/locations.json", JSON.stringify(locations));
    let routes = await getRouters(locations);
    return routes;
}

module.exports = {
    parseRawFile
}