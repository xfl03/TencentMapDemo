const axios = require("axios");
const {sleep} = require("./sleep");

async function searchInArea(keyword, boundary, category) {
    console.log(`Search ${boundary} ${category}`)
    let res = await axios.get("https://apis.map.qq.com/ws/place/v1/search", {
        params: {
            key: process.env.TENCENT_MAP_KEY,
            keyword,
            boundary,
            // filter: `category=${category}`,
            orderby:"_distance"
        },
        headers: {
            "Referer": "https://lbs.qq.com/service/webService/webServiceGuide/webServiceSearch"
        },
        timeout: 3333
    });
    return res.data;
}

async function exploreArea(boundary, category) {
    console.log(`Explore ${boundary} ${category}`)
    let res = await axios.get("https://apis.map.qq.com/ws/place/v1/explore", {
        params: {
            key: process.env.TENCENT_MAP_KEY,
            boundary,
            // filter: `category=${category}`,
            orderby:"_distance"
        },
        headers: {
            "Referer": "https://lbs.qq.com/service/webService/webServiceGuide/webServiceSearch"
        },
        timeout: 3333
    });
    return res.data;
}

function toRectBoundaryString(location0, location1) {
    return `rectangle(${location0.lat},${location0.lng},${location1.lat},${location1.lng})`;
}

function toNearbyBoundaryString(center) {
    return `nearby(${center.lat},${center.lng},200,0)`;
}

async function findOneLocation(boundary, category, type) {
    let startTime = Date.now();
    try {
        let result = type === "search" ?
            await searchInArea("公交站", boundary, category) : await exploreArea(boundary, category);
        await sleep(startTime + 200);
        if (!result.data) {
            console.log(result);
            return null;
        }
        if (result.data.length === 0) {
            // console.log(result);
            console.log("没找到");
            return null;
        }
        console.log(result.data[0].title);
        return result.data[0].location;
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

async function findBusStop(location0, location1) {
    return findOneLocation(toRectBoundaryString(location0, location1), "公交车站,公交站", "search");
}

async function findMetroStop(location0, location1) {
    return findOneLocation(toRectBoundaryString(location0, location1), "地铁站", "search");
}

async function findNearBusStop(center) {
    return findOneLocation(toNearbyBoundaryString(center), "公交车站,公交站", "search");
}

module.exports = {
    findBusStop,
    findMetroStop,
    findNearBusStop
}