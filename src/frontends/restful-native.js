'use strict'
// const request = require('request-promise-native')
// const querystring = require('querystring')

function fakeEncode(str) {
    return str
}

function AppendUrlAttr(url, data) {
    if (data.hasOwnProperty('id')) {
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
function AppendUrlId(url, data) {
    if (data.hasOwnProperty('id')) {
        if (!url.endsWith('/')) {
            url += '/'
        }
        // 为啥id的字段名就一定是主键啦- -，万一是个函数呢。。
        url += `${data.id}/`
    }
    return url
}
// FIXME: 你tm。。上面这两个函数什么鬼？url是有哪些类型你倒是注释啊……
function SyncMethod(url, method, data, callback) {
    switch(method) {
        case 'create':break;
        case 'delete':break;
        case 'update':break;
        case 'read':break;
        default: throw Error(`method ${method} is not define in SyncMethod of frontend`)
    }

    // if (['delete', 'update'].indexOf(method) > -1) {
    //     url = AppendUrlId(url, data)
    // }

    // if (method === 'read') {
    //     url = AppendUrlAttr(url, data)
    // }

    // var fetch_method = {
    //     "create": "POST",
    //     "read": "GET",
    //     "update": "PUT",
    //     "delete": "DELETE"
    // }[method]

    // var headers = {
    //     'Content-Type': 'application/json'
    // }

    // var options = {
    //     json: true,
    //     method: fetch_method,
    //     headers: headers,
    //     uri: url,
    // }

    // // if (data && (fetch_method === "PUT" || fetch_method === "POST")) {
    // //     options.body = JSON.stringify(data)
    // // }
    // // options.body = JSON.stringify(data)
    // // console.log(data)
    // options.body = data
    // request(options)
    // .then(res  => callback(undefined, res))
    // .catch(err => callback(err))
}

module.exports = SyncMethod