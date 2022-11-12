function sleep(endtime) {
    return new Promise(resolve => setTimeout(resolve, endtime - Date.now()));
}

module.exports = {
    sleep
}