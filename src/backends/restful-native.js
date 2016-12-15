'use strict'
const request = require('request-promise-native')
const querystring = require('querystring')

function fakeEncode(str) {
    return str
}

function AppendUrlAttr(url, data, pk) {
    pk = pk ? pk : 'id'
    if (data.hasOwnProperty(pk)) {
        return AppendUrlId(url, data)
    } else {
        if (!url.endsWith('/')) {
            url += '/'
        }
        if (data) {
            url += `?${querystring.stringify(data, null, null, { encodeURIComponent: fakeEncode })}`
        }
    }
    return url
}

function AppendUrlId(url, data, pk) {
    pk = pk ? pk : 'id'
    if (data.hasOwnProperty(pk)) {
        if (!url.endsWith('/')) {
            url += '/'
        }
        url += `${data[pk]}/`
    }
    return url
}

function SyncMethod(url, method, data, pk, callback) {

    if (['delete', 'update'].indexOf(method) > -1) {
        url = AppendUrlId(url, data, pk)
    }

    if (method === 'read') {
        url = AppendUrlAttr(url, data, pk)
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