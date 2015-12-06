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
        //this.emit("change"); // Already fired in remove.
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
        this.emit("change");
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
        this.emit("change");
    }
    get url() {
        return '/';
    }
    get model() {
        return Model;
    }
    comparator(left, right) {
        // TODO: Strengthen this to do alphabetical on strings.
        return left.id - right.id;
    }
    sort() {
        this.models.sort(this.comparator);

        var index = 0;
        this.models.forEach((model) => {
            this.model_lookup[model.id] = index;
            index += 1;
        });
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
        } else {
            this.element = document.createElement(this.tag);
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
    constructor(options) {
        super();
        this.automatic_navigation = true;
        if (options !== undefined) {
            if (options.hasOwnProperty('automatic_navigation')) {
                this.automatic_navigation = options.automatic_navigation;
            }
        }
        this.update_routes();
    }
    update_routes() {
        this.compiled_routes = [];
        Object.keys(this.routes).forEach((regex_string) => {
            var clean_string = this.clear_slashes(regex_string);
            let parts = clean_string.split('/');

            var new_parts = [];
            parts.forEach((part) => {
                if (part.startsWith(':')) {
                    new_parts.push('(.+)');
                } else {
                    new_parts.push(part);
                }
            });
            console.log("New Regexp String: ", '^' + new_parts.join('\/') + '$');
            var regexp = new RegExp('^' + new_parts.join('\/') + '$', 'gi');

            this.compiled_routes.push({
                regexp: regexp,
                callback: this.routes[regex_string]
            });
        });
    }
    get root() {
        return '/';
    }
    get routes() {
        return {};
    }
    navigate(path) {
        path = this.clear_slashes(path);
        history.pushState(null, null, this.root + path);
        this.compiled_routes.forEach((route) => {
            let result = route.regexp.exec(path);
            if (result !== null) {
                console.log(route, result);
                route.callback.apply(this, result.slice(1));
            }
        });
    }
    popstate(event) {
        //
    }
    clear_slashes(path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }
    start() {
        // Check for click events on a or button tags with href attributes, and navigate on click.
        if (this.automatic_navigation) {
            var body = document.getElementsByTagName('body')[0];
            body.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                console.log("Body Click");
                let element = event.target;
                if (MatchesSelector.call(element, 'a')) {
                    // Check for href
                    let href = element.getAttribute('href');
                    console.log(element, href);
                    if (href) {
                        this.navigate(href);
                    }
                }
            }, false);
        }

        // Handle window back button or history.back/history.go events.
        window.onpopstate = this.popstate.bind(this);

        // Navigate based on initial page state.
        this.navigate(window.location.pathname);
    }
}

var loaded_properly = 'loaded';

export {Model, Collection, View, Router, ExoAJAX, FetchFile, loaded_properly};
