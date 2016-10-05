'use strict';

var EventEmitter = require('events').EventEmitter;

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
            var regexp = new RegExp('^' + new_parts.join('\/') + '$', 'i');

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
                route.callback.apply(this, result.slice(1));
            }
        });
    }
    popstate(event) {
        this.navigate(window.location.pathname);
    }
    clear_slashes(path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }
    start() {
        // Check for click events on a or button tags with href attributes, and navigate on click.
        if (this.automatic_navigation) {
            document.addEventListener('click', (event) => {
                var qs = document.querySelectorAll('a');
                if (!qs || !event.target) {
                    return;
                }

                let href = event.target.getAttribute('href');
                if (!href) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();
                this.navigate(href);
            });
        }

        // Handle window back button or history.back/history.go events.
        window.onpopstate = this.popstate.bind(this);

        // Navigate based on initial page state.
        this.navigate(window.location.pathname);
    }
}

module.exports = Router;
