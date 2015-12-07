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

    method = 'asin';
    describe(method + '()', function () {
        var fnTest = m[method];

        it('should answer with value of asin', function () {
            expect(fnTest(-1)).to.be.closeTo(-Math.PI/2, 0.001);
        });

        it('should throw exception if result is not a number', function () {
            expect(fnTest).withParams(4).to.throw(RangeError);
            expect(fnTest).withParams(4)
                .to.throw('asinEx() value argument <4> must be between -1 and 1');
        });
    });

    method = 'sqrt';
    describe(method + '()', function () {
        var fnTest = m[method];

        it('should answer with value of sqrt', function () {
            expect(fnTest(9)).to.be.closeTo(3, 0.001);
        });

        it('should throw exception if result is not a number', function () {
            expect(fnTest).withParams(-1).to.throw(RangeError);
            expect(fnTest).withParams(-1)
                .to.throw('sqrtEx() value argument <-1> must be at least 0');
        });
    });

    method = 'log';
    describe(method + '()', function () {
        var fnTest = m[method];

        it('should answer with value of log', function () {
            expect(fnTest(Math.E)).to.be.closeTo(1, 0.001);
        });

        it('should throw exception if result is not a number', function () {
            expect(fnTest).withParams(0).to.throw(RangeError);
            expect(fnTest).withParams(0)
                .to.throw('logEx() value argument <0> must be greater than 0');
        });
    });

    method = 'pow';
    describe(method + '()', function () {
        var fnTest = m[method];

        it('should answer with value of pow', function () {
            expect(fnTest(10, 2)).to.be.closeTo(100, 0.001);
        });

        it('should throw exception if result is not finite', function () {
            expect(fnTest).withParams(1000, 1000).to.throw(RangeError);
            expect(fnTest).withParams(1000, 1000)
                .to.throw('Not a finite number <Infinity>');
        });
    });
});
