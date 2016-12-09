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
        json: true,
        method: fetch_method,
        headers: headers,
        uri: url,
    }

        // if (data && (fetch_method === "PUT" || fetch_method === "POST")) {
        //     options.body = JSON.stringify(data)
        // }
        // options.body = JSON.stringify(data)
        // console.log(data)
        options.body = data

    request(options)
        .then(function (repos) {
            console.log(repos)
        })
        .catch(function (err) {
            console.log(err)
            // API call failed...
        })
}

module.exports = SyncMethod