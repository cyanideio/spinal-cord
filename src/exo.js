'use strict';

import {EventEmitter} from './events.js';

function FetchFile(url, callback) {
    fetch(url).then((response) => {
        var promise = response.body();
        promise.then(callback);
    }).catch((response) => {
        console.warn("Failed to fetch file!", response);
    });
}

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

    var fetch_data = {
        method: fetch_method,
        headers: headers
    };

    if (method === "create" || method === "update") {
        fetch_data.body = JSON.stringify(data);
    }

    fetch(url, fetch_data)
    .then((response) => {
        var promise = response.json();
        promise.then(callback)
    }).catch(callback);
}

var MatchesSelector;

(function(doc) {
   MatchesSelector =
      doc.matchesSelector ||
      doc.webkitMatchesSelector ||
      doc.mozMatchesSelector ||
      doc.oMatchesSelector ||
      doc.msMatchesSelector;
})(document.documentElement);

class Model extends EventEmitter {
    constructor(data={}) {
        super();
        this.id = null;
        Object.assign(this, this.defaults, data);
    }
    sync(method, callback) {
        var data = this.serialize();
        ExoAJAX(this.url, method, this.serialize(), (response) => {
            console.log("Model.sync callback method=" + method);
            if (method === "create" || method === "update") {
                this.set(response, false);
                this.emit("saved", this);
            } else if (method === "read") {
                this.set(response, false);
                this.emit("fetched", this);
            } else if (method === "delete") {
                this.emit("deleted", this);
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
        this.sync(method, callback);
    }
    fetch(callback) {
        this.sync("read", callback);
    }
    delete(callback) {
        this.sync("delete", callback);
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
                this.emit("change", this);
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
        this.models = [];
        this.model_lookup = {};
    }
    serialize() {
        var out = [];
        this.models.forEach((model) => {
            out.push(model.serialize());
        });
        return out;
    }
    get(model_id) {
        if (this.model_lookup.hasOwnProperty(model_id)) {
            return this.models[this.model_lookup[model_id]];
        }
        return undefined;
    }
    fetch(callback) {
        ExoAJAX(this.url, "read", {}, (response) => {
            this.emit("fetched");
            this.reset(response);
            if (callback !== undefined) {
                callback(response);
            }
        });
    }
    reset(data) {
        var is_changed = false;
        var ids = [];
        data.forEach((entry) => {
            var model;
            if (this.model_lookup.hasOwnProperty(entry.id)) {
                model = this.models[this.model_lookup[entry.id]];
            } else {
                model = this.add(entry);
                is_changed = true;
            }
            ids.push(entry.id.toString());
        });

        Object.keys(this.model_lookup).forEach((model_id) => {
            var model_id_string = model_id.toString();
            if (ids.indexOf(model_id_string) === -1) {
                this.remove(this.models[this.model_lookup[model_id]]);
                is_changed = true;
            }
        });

        this.emit("change");
    }
    model_changed(model) {
        this.emit("change");
    }
    model_saved(model) {
        this.emit("change");
    }
    model_fetched(model) {
        this.emit("change");
    }
    model_deleted(model) {
        this.remove(model);
        this.emit("change");
    }
    add(data) {
        var model;
        // There's probably a better way to identify objects vs models.
        // Need to find a way to check for parent most class object, and see if it's the same as Model
        if (data.constructor.name === "Object") {
            model = new this.model(data);
        } else {
            model = data;
        }
        model.addListener("change", this.model_changed.bind(this));
        model.addListener("saved", this.model_saved.bind(this));
        model.addListener("fetched", this.model_fetched.bind(this));
        model.addListener("deleted", this.model_deleted.bind(this));
        this.models.push(model);
        this.model_lookup[model.id] = this.models.length - 1;
        this.emit("add", model);
        return model;
    }
    remove(data) {
        var id = data.id;
        var model = this.models[this.model_lookup[id]];
        model.removeListener("change", this.model_changed);
        model.removeListener("saved", this.model_saved);
        model.removeListener("fetched", this.model_fetched);
        model.removeListener("deleted", this.model_deleted);
        delete this.models[this.model_lookup[id]];
        delete this.model_lookup[id];
        this.emit("remove", data);
    }
    get url() {
        return '/';
    }
    get model() {
        return Model;
    }
}

class View extends EventEmitter {
    constructor(options) {
        super();
        if (options !== undefined) {
            if (!options.hasOwnProperty('element')) {
                this.element = document.createElement(this.tag);
                this.element.setAttribute('class', this.class_name);
            } else {
                this.element = options.element;
            }
            if (options.hasOwnProperty('model')) {
                this.model = options.model;
            }
            if (options.hasOwnProperty('collection')) {
                this.collection = options.collection;
            }
        }

        // Bind Events
        Object.keys(this.events).forEach((event_selector) => {
            var index_of = event_selector.indexOf(' ');
            var event_type;
            var selector;
            var method = this.events[event_selector];
            if (index_of !== -1) {
                event_type = event_selector.substr(0, index_of);
                selector = event_selector.substr(index_of + 1);
            } else {
                event_type = event_selector;
                selector = '';
            }

            if (selector !== '') {
                this.element.addEventListener(event_type, function(event) {
                    if (MatchesSelector.call(event.target, selector)) {
                        method(event);
                    }
                }, false);
            } else {
                this.element.addEventListener(event_type, method);
            }
        });
    }
    get class_name() {
        return '';
    }
    get tag() {
        return 'div';
    }
    get events() {
        return {};
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

export {Model, Collection, View, Router, ExoAJAX, FetchFile, loaded_properly};
