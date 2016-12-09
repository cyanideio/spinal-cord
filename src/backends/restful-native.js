'use strict'
const request = require('request-promise-native')
const querystring = require('querystring')

function AppendUrlAttr(url, data) {
    if (data.hasOwnProperty('id')) {
        return
    }
    if (data){
        if (!url.endsWith('/')) {
            url += '/'
        }
        url += `?${querystring.stringify(data, { encode: false })}/`
    }

    return url
}

function AppendUrlId(url, data) {
    if (data.hasOwnProperty('id')) {
        if (!url.endsWith('/')) {
            url += '/'
        }
        url += `${data.id}/`
    }
    return url
}

function SyncMethod(url, method, data, callback) {

    if (['delete', 'update', 'read'].indexOf(method) > -1) {
        url = AppendUrlId(url, data)
    }

    if (method === 'read') {
        url = AppendUrlAttr(url, data)
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
    .then(res  => callback(undefined, res))
    .catch(err => callback(err))
}

module.exports = SyncMethod