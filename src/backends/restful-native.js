'use strict'
const request = require('request-promise-native')

function AppendUrlId(url, data) {
    if (data.hasOwnProperty('id')) {
        if (!url.endsWith('/')) {
            url += '/'
        }
        url += data.id
    }
    return url
}

function SyncMethod(url, method, data, callback) {
    if (method !== "post") {
        url = AppendUrlId(url, data)
    }

    var fetch_method = {
        "create": "POST",
        "read": "GET",
        "update": "PUT",
        "delete": "DELETE"
    }[method]

    var headers = {
        'Content-Type': 'application/json'
    }

    var options = {
        method: fetch_method,
        headers: headers
    }

let options = {
    method: 'POST',
    uri: 'http://localhost:8000/api/v1/user/',
    headers: {
        'content-type': 'application/json'
    },
    body: {
        username: 'frank'
    },
    json: true // Automatically parses the JSON string in the response
}

rp(options)
    .then(function (repos) {
        console.log('User has %d repos', repos.length)
    })
    .catch(function (err) {
        console.log(err)
        // API call failed...
    })


    if (data && (fetch_method === "PUT" || fetch_method === "POST")) {
        options.body = JSON.stringify(data)
    }

    fetch(url, options).then((response) => {
        // response.text().then((text) => {
            // console.log("Text", text)
            // callback(null, JSON.parse(text))
        // })
        response.json().then((json) => {
            callback(null, json)
        })
    }).catch((error) => {
        callback(error, null)
    })
}

module.exports = SyncMethod