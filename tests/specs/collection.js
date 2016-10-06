var Collection = require('../../src/collection.js');

describe('collection', function() {
    it('should handle falsy values', function() {
        var c = new Collection();
        expect(c.length).toEqual(0);

        c = new Collection(null);
        expect(c.length).toEqual(0);

        c = new Collection(false);
        expect(c.length).toEqual(0);
    });
});
