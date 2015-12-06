import {Model, View, Collection, Router, FetchFile} from '../src/exo.js';

class TestModel extends Model {
    get defaults() {
        return {
            foo: 'bar',
            number: 123,
            anobj: {
                snarf: 'snarf'
            }
        };
    }
}

class TestCollection extends Collection {
    get model() {
        return TestModel;
    }
}

class TestView extends View {
    constructor() {
        super();
    }
    render() {
        //
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
});

describe('Collection', () => {
    it('should store models', () => {
        //
    });
    it('should sort models', () => {
        //
    });
    it('should allow adding models with a model', () => {
        //
    });
    it('should allow adding models with an object', () => {
        //
    });
});

describe('View', () => {
    it('should create a default element', () => {
        var test_view = new TestView();
        expect(test_view.element.tagName.toLowerCase()).toEqual('div');
    });
});

describe('Router', () => {
    it('should be able to clean a location string', () => {
        //
    });
    it('should build a regex from a route string', () => {
        //
    });
});

(function() {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.execute();
})();
