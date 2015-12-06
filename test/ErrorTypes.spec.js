// ErrorTypes.spec.js
'use strict';

var ex = require('../lib/exceptional').exceptional;

// EvalError never thrown in modern javascripts

describe('ReferenceError - when non-existent variable is referenced', function () {
    describe('thrown by javascript functions', function () {
        it('should throw a ReferenceError for undefined variable', function () {
            expect(eval).withParams('askljdff;').to.throw(ReferenceError);
            expect(eval).withParams('askljdff;')
                .to.throw('askljdff is not defined');
        });

        it('should throw a ReferenceError for ++ non-number', function () {
            expect(eval).withParams('++/this/g').to.throw(ReferenceError);
            expect(eval).withParams('++/this/g')
                .to.throw('Invalid left-hand side expression in prefix operation');
        });
    });
});

describe('SyntaxError - when syntactically invalid code interpreted', function () {
    describe('thrown by javascript functions', function () {
        it('should throw a SyntaxError for invalid code', function () {
            expect(eval).withParams('for (x;y;z;a)').to.throw(SyntaxError);
            expect(eval).withParams('for (x;y;z;a)')
                .to.throw('Unexpected token ;');
        });
    });
});

describe('URIError - when a URI function is used wrong', function () {
    describe('thrown by javascript functions', function () {
        it('should throw a URIError for invalid URI component', function () {
            expect(decodeURIComponent).withParams('%').to.throw(URIError);
            expect(decodeURIComponent).withParams('%')
                .to.throw('URI malformed');
        });

        it('should throw a URIError for invalid unicode', function () {
            expect(encodeURI).withParams('\uD800').to.throw(URIError);
            expect(encodeURI).withParams('\uD800')
                .to.throw('URI malformed');
        });

    });
});

describe('TypeError - when parameter or operand is not of the expected ' +
    'type for a function or operator', function () {

    var te = ex.TypeError;

    describe('thrown by javascript functions', function () {
        it('should throw a TypeError for no property', function () {
            expect(eval).withParams('null.f()').to.throw(TypeError);
            expect(eval).withParams('null.f()')
                .to.throw('Cannot read property \'f\' of null');
        });

        it('should throw a TypeError for non-function', function () {
            expect(eval).withParams('[2].forEach("12")').to.throw(TypeError);
            expect(eval).withParams('[2].forEach("12")')
                .to.throw('12 is not a function');
        });

        it('should throw a TypeError for non-object', function () {
            expect(eval).withParams('"w" in "42"').to.throw(TypeError);
            expect(eval).withParams('"w" in "42"')
                .to.throw('Cannot use \'in\' operator to search for \'w\' in 42');
        });
    });

    describe('throw()', function () {
        it('should throw a TypeError with useful messages', function () {
            expect(te.throw).withParams('plugh', 'a number').to.throw(TypeError);
            expect(te.throw).withParams('plugh', 'a number')
                .to.throw('argument <plugh> must be a number');
            expect(te.throw).withParams('plugh', 'a number', 'index')
                .to.throw('index argument <plugh> must be a number');
            expect(te.throw).withParams('plugh', 'a number', 'index', 'method')
                .to.throw('method() index argument <plugh> must be a number');
        });
    });
});

describe('RangeError - for numbers out of range', function () {

    var re = ex.RangeError;

    describe('thrown by javascript functions', function () {
        it('should throw a RangeError for Array creation', function () {
            var fnTest = function (length) {
                return new Array(length);
            };
            expect(fnTest).withParams(-12).to.throw(RangeError);
            expect(fnTest).withParams(-12)
                .to.throw('Invalid array length');
        });

        it('should throw a RangeError for toExponential()', function () {
            var fnTest = function (val) {
                var number = Number(42);
                return number.toExponential(val);
            };
            expect(fnTest).withParams(400).to.throw(RangeError);
            expect(fnTest).withParams(400)
                .to.throw('toExponential() argument must be between 0 and 20');
        });

        it('should throw a RangeError for toFixed()', function () {
            var fnTest = function (val) {
                var number = Number(42);
                return number.toFixed(val);
            };
            expect(fnTest).withParams(400).to.throw(RangeError);
            expect(fnTest).withParams(400)
                .to.throw('toFixed() digits argument must be between 0 and 20');
        });

        it('should throw a RangeError for toPrecision()', function () {
            var fnTest = function (val) {
                var number = Number(42);
                return number.toPrecision(val);
            };
            expect(fnTest).withParams(400).to.throw(RangeError);
            expect(fnTest).withParams(400)
                .to.throw('toPrecision() argument must be between 1 and 21');
        });
    });

    describe('throwIfInvalid()', function () {
        var fnTest = re.throwIfInvalid;

        it('should not throw for a finite number', function () {
            expect(fnTest).withParams(0).to.equal(0);
        });

        it('should throw RangeError for all invalid numbers', function () {
            expect(fnTest).withParams(NaN, 'digits', 'method').to.throw(RangeError);
            expect(fnTest).withParams(+Infinity, 'digits', 'method')
                .to.throw(RangeError);
            expect(fnTest).withParams(-Infinity, 'digits', 'method')
                .to.throw(RangeError);
            expect(fnTest).withParams(1/0, 'digits', 'method').to.throw(RangeError);
            expect(fnTest).withParams(-1/0, 'digits', 'method').to.throw(RangeError);
        });

        it('should throw TypeError for non numbers', function () {
            expect(fnTest).withParams(void 0, 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams(null, 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams(false, 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams(true, 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams('', 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams('42', 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams([], 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams({}, 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams(/[0-9]+/g, 'digits', 'method')
                .to.throw(TypeError);
            expect(fnTest).withParams(function () {}, 'digits', 'method')
                .to.throw(TypeError);
        });

        it('should throw with useful messages', function () {
            expect(fnTest).withParams(NaN)
                .to.throw('argument <NaN> must be a finite number');
            expect(fnTest).withParams(NaN, 'digits')
                .to.throw('digits argument <NaN> must be a finite number');
            expect(fnTest).withParams(NaN, 'digits', 'method')
                .to.throw('method() digits argument <NaN> must be a finite number');
        });

    });

    describe('throwIfOutOfRange()', function () {
        var fnTest = re.throwIfOutOfRange;

        it('should not throw for a finite number', function () {
            expect(fnTest).withParams(0).to.equal(0);
        });

        it('should throw RangeError for invalid numbers', function () {
            expect(fnTest).withParams(NaN).to.throw(RangeError);
        });

        it('should throw TypeError for non numbers', function () {
            expect(fnTest).withParams(void 0, 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams(null, 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams(false, 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams(true, 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams('', 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams('42', 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams([], 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams({}, 'digits', 'method').to.throw(TypeError);
            expect(fnTest).withParams(/[0-9]+/g, 'digits', 'method')
                .to.throw(TypeError);
            expect(fnTest).withParams(function () {}, 'digits', 'method')
                .to.throw(TypeError);
        });

        it('should throw RangeError when out of range', function () {
            expect(fnTest).withParams(0, 2, 4).to.throw(RangeError);
        });

        it('should throw with useful messages', function () {
            expect(fnTest).withParams(0, 2, 4)
                .to.throw('argument <0> must be between 2 and 4');
            expect(fnTest).withParams(0, 2, 4, 'digits')
                .to.throw('digits argument <0> must be between 2 and 4');
            expect(fnTest).withParams(0, 2, 4, 'digits', 'method')
                .to.throw('method() digits argument <0> must be between 2 and 4');
            expect(fnTest).withParams(0, 2)
                .to.throw('argument <0> must be at least 2');
            expect(fnTest).withParams(0, void 0, -2)
                .to.throw('argument <0> must be at most -2');
        });

    });

});
