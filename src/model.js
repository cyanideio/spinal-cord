'use strict'

const EventEmitter = require('events').EventEmitter
const SyncMethod = require('./backends/restful-native')

// <<<<<<<<<<
// Is it Model replace the Backbone.Model?
class Model extends EventEmitter {
    // <<<<<<<<<
    // defaults setting?
    get defaults() {
        return {}
    }
    // <<<<<<<<<
    // what types?
    get types() {
        return {}
    }
    constructor(data) {
        super()

        // <<<<<<<<
        // 不是可以constructor(data = {}) 这样定义初始值的么？而且这样起名options会不会好点- -
        if (data === undefined) {
            data = {}
        }

        this.id = null
        Object.assign(this, this.defaults, data)

        // TODO: Add some validation for a few non-class types, ints, floats, strings, arrays, objects, etc.
        //  Auto-cooerce when possible to these types?
        Object.keys(this.types).forEach((property_name) => {
            // <<<<<<<<<<<<
            // 'instanceof' not always work very well,notice that:
            // let a = new A(); a instanceof A is True
            // B = _.extend(A,{})
            // let b = new B(); b instanceof A is False
            // not like java
            // What's more: they exists for what? for example?
            // >>>>>>>>>>>>
            if (!(this[property_name] instanceof this.types[property_name])) {
                this[property_name] = new this.types[property_name](this[property_name])
            }
        })
    }
    get SyncMethod() {
        return SyncMethod
    }

    parse(resp, options){
        return resp
    }

    sync(method, options) {
        // <<<<<<<<<<<<<<
        // Backbone Model return a xhr here, are you sure it is ok?
        options = options ? options : {}
        return new Promise((resolve, reject) => {
            this.SyncMethod(this.url, method, this.serialize(), (error, response) => {
                if (error) {
                    console.error("Error with AJAX Method: ", this.url, method)
                    reject(error, response)
                    return
                }
                let serverAttrs = options.parse ? options.parse(response, options):this.parse(response, options)
                if (method === "create" || method === "update") {
                    this.set(serverAttrs, false)
                    this.emit("saved", this)
                } else if (method === "read") {
                    this.set(serverAttrs, false)
                    this.emit("fetched", this)
                } else if (method === "delete") {
                    this.emit("deleted", this)
                }
                resolve(serverAttrs)
            })
        })
    }

    save(data) {
        var args = arguments
        var method = this.id === null ? "create" : "update"
        if (data !== undefined) {
            this.set(data, false)
        }
        return this.sync(method)
    } 

    get() {
        return this.sync("read")
    }

    delete() {
        return this.sync("delete")
    }
    validate(data) {
        //
    }

    serialize() {
        // <<<<<<<<<<<<
        // Sorry..but, what's that?
        let _reserved_kwd = ['domain', '_events', '_eventsCount', '_maxListeners', '__collection_id']
        var out = {}
        Object.keys(Object.assign(this, this.defaults)).forEach((key) => {
            if (_reserved_kwd.indexOf(key) > -1) {
                return 
            }
            if (key === "id" && this.id === null) {
                return
            }
            out[key] = this[key]
            if (this[key] !== null && this[key] !== undefined && this[key].constructor.name) {
                if (this[key].constructor.name !== 'String' && this[key].constructor.name !== 'Number' &&
                    this[key].constructor.name !== 'Boolean' && this[key].constructor.name !== 'Object' &&
                    this[key].constructor.name !== 'Array') {
                    out[key] = this[key].serialize()
                }
            }
        })
        return out
    }

    toJSON(){
       return this.serialize() 
    }

    get url() {
        return '/'
    }
    // TODO: Uncomment this when function default args are supported.
    //set(data, emit_change_event=true) {
    set(data, emit_change_event) {
        if (emit_change_event === undefined) {
            emit_change_event = true
        }
        var temp_data = Object.assign({}, this, data)
        try {
            this.validate(temp_data)
            Object.assign(this, temp_data)
            if (emit_change_event) {
                this.emit("change", this)
            }
            return true
        } catch (exception) {
            // Trigger event instead.
            console.warn(exception)
            this.emit("invalid", exception)
            return false
        }
    }
}

module.exports = Model
