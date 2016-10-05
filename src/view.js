'use strict';

var EventEmitter = require('events').EventEmitter;

class View extends EventEmitter {
    get tag() {
        return 'div';
    }
    get class_name() {
        return '';
    }
    get events() {
        return {};
    }
    on(event_type, callback, selector) {
        if (selector !== undefined) {
            document.addEventListener(event_type, function(event) {
                var qs = document.querySelectorAll(selector);
                if (qs) {
                    var el = event.target, index = -1;
                    while (el && ((index = Array.prototype.indexOf.call(qs, el)) === -1)) {
                        el = el.parentElement;
                    }

                    if (index > -1) {
                        callback.call(el, event);
                    }
                }
            });
        } else {
            this.element.addEventListener(event_type, method);
        }
    }
    constructor(options) {
        super();

        if (options !== undefined) {
            if (!options.hasOwnProperty('element')) {
                this.element = document.createElement(this.tag);
                if (this.class_name !== '') {
                    this.element.classList.add(this.class_name);
                }
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
                selector = undefined;
            }

            this.on(event_type, method, selector);
        });
    }
    destructor() {
        // TODO UNBIND ELEMENTS, AND OTHER CLEANUP!
    }
    render() {
        return this.element;
    }
}

module.exports = View;
