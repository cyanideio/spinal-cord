var Model = require('../../src/model.js');

class CModel extends Model {
    get defaults() {
        return {
            derp: 'poop'
        }
    }
}

class TestModel extends Model {
    get defaults() {
        return {
            a: 1,
            b: 'two',
            c: {derp: 'ferp'}
        }
    }
    get types() {
        return {
            c: CModel
        }
    }
    constructor(data) {
        super(data);
    }
}

describe('model', function() {
    it('should handle defaults', function() {
        var model = new TestModel();
        expect(model.a).toEqual(1);
        expect(model.c instanceof CModel).toEqual(true);
    });
});
