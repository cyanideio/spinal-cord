'use strict';

function AppendUrlId(url, data) {
    if (data.hasOwnProperty('id')) {
        if (!url.endsWith('/')) {
            url += '/';
        }
        url += data.id;
    }
    return url;
}

function AjaxMethod(url, method, data, callback) {
    if (method !== "post") {
        url = AppendUrlId(url, data);
    }

    var fetch_method = {
        "create": "POST",
        "read": "GET",
        "update": "PUT",
        "delete": "DELETE"
    }[method];

    var session_id = window.localStorage.getItem('stat_stratus_session');

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-session-id', session_id);

    var options = {
        method: fetch_method,
        headers: headers
    };

    if (data && (fetch_method === "PUT" || fetch_method === "POST")) {
        options.body = JSON.stringify(data);
    }

    fetch(url, options).then((response) => {
        // response.text().then((text) => {
            // console.log("Text", text);
            // callback(null, JSON.parse(text));
        // });
        response.json().then((json) => {
            callback(null, json);
        });
    }).catch((error) => {
        callback(error, null);
    });
}

module.exports = AjaxMethod;
