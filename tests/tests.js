/*jshint esnext: true */
/*jshint node: true */

'use strict';

var Exo = require("../src/exo.js");
// import {Model, View, Collection, Router, FetchFile} from '../src/exo.js';

// TODO: Need reliable way to override this globally (for the library) so we can use it on backends too without needing to provide an alt for each model separately.
function AJAXOverride(url, method, data, callback) {
    // console.log("EXO AJAX OVERRIDE: ", method, data);
    var fetch_method = {
        "create": "POST",
        "read": "GET",
        "update": "PUT",
        "delete": "DELETE"
    }[method];

    if (!data.hasOwnProperty('id') && method === "read") {
        callback([]);
    } else {
        callback(data);
    }
}

class TestModel extends Exo.Model {
    get defaults() {
        return {
            foo: 'bar',
            number: 123,
            anobj: {
                snarf: 'snarf'
            }
        };
    }
    get AjaxMethod() {
        return AJAXOverride;
    }
    validate(data) {
        if (data.number === 1337) {
            throw 'number is incorrect';
        }
    }
}

class TestCollection extends Exo.Collection {
    get model() {
        return TestModel;
    }
    get AjaxMethod() {
        return AJAXOverride;
    }
    comparator(left, right) {
        if (left.number < right.number) {
            return -1;
        } else if (left.number > right.number) {
            return 1;
        }
        return 0;
    }
}

class TestView extends Exo.View {
    constructor(options) {
        super(options);
        this.that_guy_clicked = false;
    }
    guy_clicked() {
        this.that_guy_clicked = true;
    }
    get events() {
        return {
            'click .thatguy': this.guy_clicked.bind(this)
        };
    }
    render() {
        this.element.innerHTML = 'test content';
    }
}

class TestRouter extends Exo.Router {
    constructor() {
        super({automatic_navigation: false});
        this.show_test_called = false;
        this.show_test_called_id = null;
    }
    show_test(test_id) {
        this.show_test_called = true;
        this.show_test_called_id = test_id;
    }
    get routes() {
        return {
            '/test/:test_id': this.show_test.bind(this)
        };
    }
}

describe('Model', () => {
    it('should use the model defaults', () => {
        var test_model = new TestModel();
        expect(test_model.foo).toEqual('bar');
        expect(test_model.number).toEqual(123);
        expect(test_model.anobj.snarf).toEqual('snarf');
    });
    it('should allow defaults to be overridden', () => {
        var test_model = new TestModel({
            foo: 'wee'
        });
        expect(test_model.foo).toEqual('wee');
        expect(test_model.number).toEqual(123);
        expect(test_model.anobj.snarf).toEqual('snarf');
    });
    it('should be able to validate itself', () => {
        var test_model = new TestModel();
        test_model.addListener('invalid', (msg) => {
            expect(msg).toEqual('number is incorrect');
            console.log("Invalid: ", msg);
        });
        test_model.set({number: 1337});
    });
    it('should fire a saved event when new model is persisted to server', () => {
        var model = new TestModel();
        var saved_fired = false;
        model.addListener('saved', () => {saved_fired = true;});
        model.save(() => {/* NO OP */});
        expect(saved_fired).toEqual(true);
    });
    it('should fire a saved event when a model is updated on the server', () => {
        var model = new TestModel({id: 1});
        var saved_fired = false;
        model.addListener('saved', () => {saved_fired = true;});
        model.save(() => {/* NO OP */});
        expect(saved_fired).toEqual(true);
    });
    it('should fire a fetched event when retrieved from the server', () => {
        var model = new TestModel({id: 1});
        var fetched_fired = false;
        model.addListener('fetched', () => {fetched_fired = true;});
        model.fetch();
        expect(fetched_fired).toEqual(true);
    });
    it('should fire a deleted event when deleted from the server', () => {
        var model = new TestModel({id: 1});
        var deleted_fired = false;
        model.addListener('deleted', () => {deleted_fired = true;});
        model.delete();
        expect(deleted_fired).toEqual(true);
    });
    it('should fire a change event when data is changed', () => {
        var model = new TestModel();
        var change_fired = false;
        model.addListener('change', () => {change_fired = true;});
        model.set({foo: 'abc'});
        expect(change_fired).toEqual(true);
    });
});

describe('Collection', () => {
    it('should store models', () => {
        let collection = new TestCollection([
            new TestModel({id: 1})
        ]);
        console.log(collection);
        expect(collection.models.length).toEqual(1);
    });
    it('should sort models', () => {
        let collection = new TestCollection([
            new TestModel({id: 2, number: 2}),
            new TestModel({id: 1, number: 1}),
            new TestModel({id: 3, number: 3})
        ]);
        expect(collection.models[0].number).toEqual(2);
        expect(collection.models[1].number).toEqual(1);
        expect(collection.models[2].number).toEqual(3);
        collection.sort();
        expect(collection.models[0].number).toEqual(1);
        expect(collection.models[1].number).toEqual(2);
        expect(collection.models[2].number).toEqual(3);
    });
    it('should allow adding models with a model', () => {
        let collection = new TestCollection();
        collection.add(new TestModel({id: 1}));
        expect(collection.models.length).toEqual(1);
    });
    it('should allow adding models with an object', () => {
        let collection = new TestCollection();
        collection.add({id: 1});
        expect(collection.models.length).toEqual(1);
    });
    it('should fire a fetched event when fetched from the server', () => {
        var collection = new TestCollection();
        var fetched_fired = false;
        collection.addListener('fetched', () => {fetched_fired = true;});
        collection.fetch();
        expect(fetched_fired).toEqual(true);
    });
    it('should fire a change event when reset', () => {
        var collection = new TestCollection();
        var reset_fired = false;
        collection.addListener('change', () => {reset_fired = true;});
        collection.reset([]);
        expect(reset_fired).toEqual(true);
    });
    it('should fire a change event when a model has changed', () => {
        var model = new TestModel({id: 1});
        var collection = new TestCollection([model]);
        var change_fired = false;
        collection.addListener('change', () => {change_fired = true;});
        model.set({foo: 'abc'});
        expect(change_fired).toEqual(true);
    });
    it('should fire a change event when a model was saved', () => {
        var model = new TestModel({id: 1});
        var collection = new TestCollection([model]);
        var change_fired = false;
        collection.addListener('change', () => {change_fired = true;});
        model.save(() => {});
        expect(change_fired).toEqual(true);
    });
    it('should fire a change event when a model is fetched', () => {
        var model = new TestModel({id: 1});
        var collection = new TestCollection([model]);
        var change_fired = false;
        collection.addListener('change', () => {change_fired = true;});
        model.fetch();
        expect(change_fired).toEqual(true);
    });
    it('should fire an add and change event when a model is added', () => {
        var model = new TestModel({id: 1});
        var collection = new TestCollection([model]);
        var change_fired = false;
        var add_fired = false;
        collection.addListener('change', () => {change_fired = true;});
        collection.addListener('add', () => {add_fired = true;});
        collection.add({id: 2, foo: 'abc'});
        expect(change_fired).toEqual(true);
        expect(add_fired).toEqual(true);
    });
    it('should fire a remove and change event when a model is removed', () => {
        var model = new TestModel({id: 1});
        var collection = new TestCollection([model]);
        var change_fired = false;
        var remove_fired = false;
        collection.addListener('change', () => {change_fired = true;});
        collection.addListener('remove', () => {remove_fired = true;});
        collection.remove(model);
        expect(change_fired).toEqual(true);
        expect(remove_fired).toEqual(true);
    });
    it('should fire a remove and change event when a model is deleted', () => {
        var model = new TestModel({id: 1});
        var collection = new TestCollection([model]);
        var change_fired = false;
        var remove_fired = false;
        collection.addListener('change', () => {change_fired = true;});
        collection.addListener('remove', () => {remove_fired = true;});
        model.delete();
        expect(change_fired).toEqual(true);
        expect(remove_fired).toEqual(true);
    });
});

describe('View', () => {
    it('should create a default element', () => {
        var test_view = new TestView();
        expect(test_view.element.tagName.toLowerCase()).toEqual('div');
    });
    it('should not create a default element when one is provided', () => {
        var test_view = new TestView({element: document.createElement('span')});
        expect(test_view.element.tagName.toLowerCase()).toEqual('span');
    });
    it('should render into its own element', () => {
        var test_view = new TestView();
        test_view.render();
        expect(test_view.element.innerHTML).toEqual('test content');
    });
    it('should only bind to events within its own elements scope', () => {
        var element = document.createElement('div');
        element.innerHTML = '<button class="thatguy">That Guy</button>';
        var another = document.createElement('div');
        another.innerHTML = '<button class="thatguy">Another Guy</button>';
        document.getElementsByTagName('body')[0].appendChild(another);
        document.getElementsByTagName('body')[0].querySelector('.thatguy').click();
        var test_view = new TestView({element: element});
        expect(test_view.that_guy_clicked).toEqual(false);
        test_view.element.querySelector('.thatguy').click();
        expect(test_view.that_guy_clicked).toEqual(true);
        another.innerHTML = '';
    });
    it('should be able to bind to model events', () => {
        class AnotherView extends Exo.View {
            constructor(options) {
                super(options);
                this.model.addListener('change', this.render.bind(this));
            }
            render() {
                this.element.innerHTML = this.model.foo;
            }
        }
        var model = new TestModel();
        var view = new AnotherView({
            model: model
        });
        view.render();
        expect(view.element.innerHTML).toEqual('bar');

        model.set({foo: 'baz'});
        expect(view.element.innerHTML).toEqual('baz');
    });
    it('should be able to bind to collection events', () => {
        var collection = new TestCollection([
            {id: 1, foo: 'a'},
            {id: 2, foo: 'b'},
            {id: 3, foo: 'c'}
        ]);

        class AnotherView extends Exo.View {
            constructor(options) {
                super(options);
                this.collection.addListener('change', this.render.bind(this));
            }
            render() {
                var foos = [];
                this.collection.models.forEach((model) => {
                    foos.push(model.foo);
                });
                this.element.innerHTML = foos.join(',');
            }
        }

        var view = new AnotherView({collection: collection});
        view.render();

        expect(view.element.innerHTML).toEqual('a,b,c');

        collection.add(new TestModel({id: 4, foo: 'd'}));
        expect(view.element.innerHTML).toEqual('a,b,c,d');
    });
});

describe('Router', () => {
    it('should be able to clean a location string', () => {
        let router = new TestRouter();
        expect(router.clear_slashes('/some/route/path/id/')).toEqual('some/route/path/id');
    });
    it('should build a regex from a route string', () => {
        let router = new TestRouter();
        expect(router.compiled_routes.length).toEqual(1);
    });
    it('should navigate to the correct route when invoked', () => {
        let router = new TestRouter();
        router.navigate('/test/25');
        expect(router.show_test_called).toEqual(true);
        expect(router.show_test_called_id).toEqual('25');
        router.navigate('/');
    });
});

describe('Ensure', () => {
    it('should be able to wait on a provided methods results', () => {
        expect(typeof Exo.Ensure(() => {return true;})).toEqual('object');

        // TODO: NEED TO SET THIS UP TO BE A REAL ASYNC TEST!
        Exo.Ensure(() => {return true;}).then(expect(true).toEqual(true));
    });
});
