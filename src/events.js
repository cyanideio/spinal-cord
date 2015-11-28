'use strict';

// Modified from https://gist.github.com/datchley/37353d6a2cb629687eb9

let isFunction = function(obj) {
    return typeof obj == 'function' || false;
};

class EventEmitter {
    constructor() {
      this.listeners = new Map();
      this.oneTimeListeners = new Map();
    }
    addListener(label, callback) {
        this.listeners.has(label) || this.listeners.set(label, []);
        this.listeners.get(label).push(callback);
    }
    addOneTimeListener(label, callback) {
        this.oneTimeListeners.has(label) || this.oneTimeListeners.set(label, []);
        this.oneTimeListeners.get(label).push(callback);
    }
    removeListener(label, callback) {
        var found_listener = false;

        let listeners = this.listeners.get(label), index;
        if (listeners && listeners.length) {
            index = listeners.reduce((i, listener, index) => {
                return (isFunction(listener) && listener === callback) ? i = index : i;
            }, -1);

            if (index > -1) {
                listeners.splice(index, 1);
                this.listeners.set(label, listeners);
                found_listener = true;
            }
        }

        let oneTimeListeners = this.oneTimeListeners.get(label);
        if (oneTimeListeners && oneTimeListeners.length) {
            index = oneTimeListeners.reduce((i, listener, index) => {
                return (isFunction(listener) && listener === callback) ? i = index : i;
            }, -1);

            if (index > -1) {
                oneTimeListeners.splice(index, 1);
                this.oneTimeListeners.set(label, oneTimeListeners);
                found_listener = true;
            }
        }

        return found_listener;
    }
    emit(label, ...args) {
        console.log("Event.emit", label);
        let found_listener = false;

        let listeners = this.listeners.get(label);
        if (listeners && listeners.length) {
            listeners.forEach((listener) => {
                listener(...args);
            });
            found_listener = true;
        }

        let oneTimeListeners = this.oneTimeListeners.get(label);
        if (oneTimeListeners && oneTimeListeners.length) {
            oneTimeListeners.forEach((listener) => {
                listener(...args);
                this.removeListener(label, listener);
            });
            found_listener = true;
        }

        return found_listener;
    }
}

export {EventEmitter};
