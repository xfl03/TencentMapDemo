const axios = require("axios");
const {sleep} = require("./sleep");

async function findRoute(from, to, waypoints) {
    console.log(`${from}->${waypoints}->${to}`)
    let res = await axios.get("https://apis.map.qq.com/ws/direction/v1/driving/", {
        params: {
            key: process.env.TENCENT_MAP_KEY,
            from,
            to,
            waypoints,
            policy:"NAV_POINT_FIRST"
        },
        headers: {
            "Referer": "https://lbs.qq.com/service/webService/webServiceGuide/webServiceRoute"
        },
        timeout: 3333
    });
    return res.data;
}

function parseLocation(location) {
    return `${location.lat},${location.lng}`;
}

function parseWayPoints(waypoints) {
    return waypoints.map(it => parseLocation(it)).join(";");
}

async function getRouters(locations) {
    console.log(`Locations: ${locations.length}`);
    let chunks = (locations.length) / 32;
    let ret = [];
    for (let i = 0; i < chunks; ++i) {
        let startTime = Date.now();
        let arr = locations.slice(i * 32, Math.min(locations.length, (i + 1) * 32));
        let from = parseLocation(arr[0]);
        let to = parseLocation(arr[arr.length - 1]);
        let waypoints = parseWayPoints(arr.slice(1, -1));
        let result = await findRoute(from, to, waypoints);
        await sleep(startTime + 200);
        if (!result.result || !result.result.routes) {
            console.log(result);
            continue;
        }
        console.log(`Find route with distance ${result.result.routes[0].distance}`)
        ret.push(result.result.routes[0].polyline);
    }
    return ret;
}

module.exports = {
    getRouters
}