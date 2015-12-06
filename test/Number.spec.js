// global.spec.js
'use strict';

var	ex = require('../lib/exceptional').exceptional,
	n = ex.global;

describe('global methods', function () {
	var method = 'parseFloat';
	describe(method + '()', function () {
		var fnTest = n['' + method];

		it('should answer with number from string', function () {
			expect(fnTest('12.34')).to.be.equal(12.34);
		});

		it('should throw exception if not a floating point number', function () {
			expect(fnTest).withParams('exceptional').to.throw(TypeError);
			expect(fnTest).withParams('exceptional')
				.to.throw('parseFloatEx() string argument <exceptional> ' +
					'must be a string representing a floating point number');
		});
	});
});
