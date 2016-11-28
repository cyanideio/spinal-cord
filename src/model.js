'use strict';

const EventEmitter = require('events').EventEmitter;
const AjaxMethod = require('./ajax.js');

class Model extends EventEmitter {
    get defaults() {
        return {};
    }
    get types() {
        return {};
    }
    constructor(data) {
        super();

        if (data === undefined) {
            data = {};
        }

        this.id = null;
        Object.assign(this, this.defaults, data);

        // TODO: Add some validation for a few non-class types, ints, floats, strings, arrays, objects, etc.
        //  Auto-cooerce when possible to these types?
        Object.keys(this.types).forEach((property_name) => {
            if (!(this[property_name] instanceof this.types[property_name])) {
                this[property_name] = new this.types[property_name](this[property_name]);
            }
        });
    }
    destructor() {
        // TODO, look at View
    }
    get AjaxMethod() {
        return AjaxMethod;
    }
    sync(method) {
        return new Promise((resolve, reject) => {
            var data = this.serialize();
            this.AjaxMethod(this.url, method, this.serialize(), (error, response) => {
                if (error) {
                    console.error("Error with AJAX Method: ", this.url, method);
                    reject(error, response);
                    return;
                }

                if (method === "create" || method === "update") {
                    this.set(response, false);
                    this.emit("saved", this);
                } else if (method === "read") {
                    this.set(response, false);
                    this.emit("fetched", this);
                } else if (method === "delete") {
                    this.emit("deleted", this);
                }
                resolve(response);
            });
        });
    }
    save(data) {
        var args = arguments;
        var method = this.id === null ? "create" : "update";
        if (data !== undefined) {
            this.set(data, false);
        }
        return this.sync(method);
    }
    fetch() {
        return this.sync("read");
    }
    delete() {
        return this.sync("delete");
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
            if (this[key] !== null && this[key] !== undefined && this[key].constructor.name) {
                if (this[key].constructor.name !== 'String' && this[key].constructor.name !== 'Number' &&
                    this[key].constructor.name !== 'Boolean' && this[key].constructor.name !== 'Object' &&
                    this[key].constructor.name !== 'Array') {
                    out[key] = this[key].serialize();
                }
            }
        });
        return out;
    }
    get url() {
        return '/';
    }
    // TODO: Uncomment this when function default args are supported.
    //set(data, emit_change_event=true) {
    set(data, emit_change_event) {
        if (emit_change_event === undefined) {
            emit_change_event = true;
        }
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

module.exports = Model;
