// Math.spec.js
'use strict';

var	ex = require('../lib/exceptional').exceptional,
    m = ex.Math;

describe('Math methods', function () {

    var method = 'acos';
    describe(method + '()', function () {
        var fnTest = m[method];

        it('should answer with value of acos', function () {
            expect(fnTest(-1)).to.be.closeTo(Math.PI, 0.001);
        });

        it('should throw exception if result is not a number', function () {
            expect(fnTest).withParams(4).to.throw(RangeError);
            expect(fnTest).withParams(4)
                .to.throw('acosEx() value argument <4> must be between -1 and 1');
        });
    });
});
