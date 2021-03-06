/*
    MapFrame extands Map in JS to have functionalities similar to Python's Panda DataFrame
    Basic Usage:
    frame = new MapFrame ({url, metrics, dimensions, id}, initialArray)
    frame.filter((val, id) => )
    frame.map((val, id) => val)
    frame.reduce((val, id) => )
    frame.info({metrics, filter_ids, subset})
    frame.unfo({filter_ids})
    frame.clean()
    frame.info({clean: true})
    frame.reset()

Example:
var cdn_host = "http://127.0.01:8887/cdn/",
      data_host = "http://127.0.01:8887/data/"
url = data_host + "latest housing valuation.csv"
id = 'Fips'
frame = new MapFrame({id, url})
*/


async function load_libraries () {
    libraries = [
        "papaparse.min.js",
        //"topojson.v1.min.js",
        //"crossfilter.min.js",
        //"d3.v3.min.js",
        //"d3.tip.v0.6.3.js",
        //"jsoneditor-minimalist.min.js"
    ]
    for(let url of libraries) {
        await fetch(cdn_host+url).then(res => res.text()).then(eval)
    }
}
load_libraries()


class MapFrame extends Map {
    constructor ({url, text, array, id, metrics, dimensions}, arr) {
        super(arr)
        this.info({id, metrics, dimensions})
        var parser = 'fromCSV'
        if (url) {
            fetch(url)
                .then(res => res.text())
                .then(text => Papa.parse(text, {dynamicTyping: true, header: true}))
                .then(papa => this[parser](papa.data))
                return
        }
    }
}

MapFrame.prototype.fromCSV = function (data) {
    let id = this.id
    data.forEach(row => {
        this.set(row[id], row)
    })
    return this
}

MapFrame.prototype.info = function (obj) {
    for ([key, value] of Object.entries(obj)) {
        this[key] = value
    }
    return this
}


MapFrame.prototype.unfo = function (keys) {
    keys.forEach(k => delete this[k])  
    return this
}

