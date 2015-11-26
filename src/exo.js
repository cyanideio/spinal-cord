'use strict';

import {EventEmitter} from './events.js';

function AppendUrlId(url, data) {
    if (data.hasOwnProperty('id')) {
        if (!url.endsWith('/')) {
            url += '/';
        }
        url += data.id;
    }
    return url;
}

function ExoAJAX(url, method, data, callback) {
    if (method !== "post") {
        url = AppendUrlId(url, data);
    }
    var fetch_method = {
        "create": "POST",
        "read": "GET",
        "update": "PUT",
        "delete": "DELETE"
    }[method];

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    fetch(url, {
        method: fetch_method,
        headers: headers,
        data: JSON.stringify(data)
    }).then((response) => {
        callback(JSON.parse(response));
    }).catch(callback);
}

class Model extends EventEmitter {
    constructor(data={}) {
        super();
        this.id = null;
        Object.assign(this, this.defaults, data);
    }
    sync(method, callback) {
        ExoAJAX(this.url, method, this.serialize(), (response) => {
            console.log("Response: ", response);
            if (method === "create" || method === "update") {
                this.emit("saved");
            } else if (method === "read") {
                this.emit("fetched");
            } else if (method === "delete") {
                this.emit("deleted");
            }
            if (callback !== undefined) {
                callback(response);
            }
        });
    }
    save(...args) {
        var callback = undefined;
        var method = this.id === null ? "create" : "update";
        if (args.length === 2 && typeof args[0] === "object" && typeof args[1] === "function") {
            this.set(args[0], false);
            callback = args[1];
        } else if (args.length === 1 && typeof args[0] === "function") {
            callback = args[0];
        } else if (args.length !== 0) {
            console.warn("Invalid arguments to Model.save", args);
            return;
        }
        sync(method, callback);
    }
    fetch(callback) {
        sync("read", callback);
    }
    delete(callback) {
        sync("delete", callback);
    }
    validate(data) {
        //
    }
    serialize() {
        var out = {};
        Object.keys(Object.assign({}, this.defaults, {"id": null})).forEach((key) => {
            if (key === "id" && this.id === null) {
                return;
            }
            out[key] = this[key];
        });
        return out;
    }
    get url() {
        return '/';
    }
    get defaults() {
        return {};
    }
    set(data, emit_change_event=true) {
        var temp_data = Object.assign({}, this, data);
        try {
            this.validate(temp_data);
            Object.assign(this, temp_data);
            if (emit_change_event) {
                this.emit("change");
            }
            return true;
        } catch (exception) {
            // Trigger event instead.
            console.warn(exception);
            this.emit("invalid", exception);
            return false;
        }
    }
}

class Collection extends EventEmitter {
    constructor() {
        super();
    }
}

class View extends EventEmitter {
    constructor(options) {
        super();
        if (!options.hasOwnProperty('element')) {
            this.element = document.createElement(this.tag());
        }
    }
    get tag() {
        return 'div';
    }
    render() {
        return this.element;
    }
}

class Router extends EventEmitter {
    constructor() {
        super();
    }
}

var loaded_properly = 'loaded';

export {Model, Collection, View, Router, loaded_properly};
