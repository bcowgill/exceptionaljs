// global.spec.js
'use strict';

var	ex = require('../lib/exceptional').exceptional,
	n = ex.global;

describe('global methods', function () {

	var method = 'parseFloat';
	describe(method + '()', function () {
		var fnTest = n[method];

		it('should answer with number from string', function () {
			expect(fnTest('12.34lb')).to.be.equal(12.34);
		});

		it('should throw exception if not a floating point number', function () {
			expect(fnTest).withParams('exceptional').to.throw(TypeError);
			expect(fnTest).withParams('exceptional')
				.to.throw('parseFloatEx() string argument <exceptional> ' +
					'must be a string representing a floating point number');
		});

		it('should throw exception if an empty string', function () {
			expect(fnTest).withParams('   ')
					.to.throw('parseFloatEx() string argument <   > ' +
					'must be a string representing a floating point number');
		});

		it('should throw exception if Infinity', function () {
			expect(fnTest).withParams('-Infinity').to.throw(RangeError);
			expect(fnTest).withParams('-Infinity')
					.to.throw('parseFloatEx() string argument <-Infinity> ' +
					'must be a string representing a finite floating point number');
		});
	});

	method = 'parseInt';
	describe(method + '()', function () {
		var fnTest = n[method];

		it('should answer with number from string', function () {
			expect(fnTest('11mm', 10)).to.be.equal(11);
		});

		it('should answer with number from string using radix', function () {
			expect(fnTest('11mm', 3)).to.be.equal(4);
		});

		it('should throw exception if radix invalid', function () {
			expect(fnTest).withParams('11mm', 1).to.throw(RangeError);
			expect(fnTest).withParams('11mm', 1)
				.to.throw('parseIntEx() radix argument <1> must be between 2 and 36');
			expect(fnTest).withParams('11mm', 37)
				.to.throw('parseIntEx() radix argument <37> must be between 2 and 36');
		});

		it('should throw exception if not an integer number', function () {
			expect(fnTest).withParams('exceptional', 10).to.throw(TypeError);
			expect(fnTest).withParams('exceptional', 10)
				.to.throw('parseIntEx() string argument <exceptional> ' +
					'must be a string representing an integer number');
		});

		it('should throw exception if an empty string', function () {
			expect(fnTest).withParams('   ', 10)
					.to.throw('parseIntEx() string argument <   > ' +
					'must be a string representing an integer number');
		});

		it('should throw exception if -Infinity', function () {
			expect(fnTest).withParams('-Infinity', 10).to.throw(TypeError);
			expect(fnTest).withParams('-Infinity', 10)
					.to.throw('parseIntEx() string argument <-Infinity> ' +
					'must be a string representing an integer number');
		});
	});

	method = 'isNaN';
	describe(method + '()', function () {
		var fnTest = n[method];

		it('should answer with number if not considered NaN', function () {
			expect(fnTest(42)).to.be.equal(42);
		});

		it('should answer with -Infinity', function () {
			expect(fnTest(-Infinity)).to.be.equal(-Infinity);
		});

		it('should throw exception if value is NaN', function () {
			expect(fnTest).withParams(NaN).to.throw(RangeError);
			expect(fnTest).withParams(NaN)
				.to.throw('Not a Number (NaN)');
		});

	});

	method = 'isFinite';
	describe(method + '()', function () {
		var fnTest = n[method];

		it('should answer with number if not infinite', function () {
			expect(fnTest(42)).to.be.equal(42);
		});

		it('should throw exception if value is -Infinity', function () {
			expect(fnTest).withParams(-Infinity).to.throw(RangeError);
			expect(fnTest).withParams(-Infinity)
				.to.throw('Not a finite number <-Infinity>');
		});

		it('should throw exception if value is Infinity', function () {
			expect(fnTest).withParams(Infinity).to.throw(RangeError);
			expect(fnTest).withParams(Infinity)
					.to.throw('Not a finite number <Infinity>');
		});

		it('should throw exception if value is NaN', function () {
			expect(fnTest).withParams(NaN).to.throw(RangeError);
			expect(fnTest).withParams(NaN)
					.to.throw('Not a finite number <NaN>');
		});

	});
});
