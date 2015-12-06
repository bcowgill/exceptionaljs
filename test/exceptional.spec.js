// exceptional.spec.js
'use strict';

var	ex = require('../lib/exceptional').exceptional;

describe('augment()', function () {

	afterEach(function () {
		ex.unaugment();
	});

	it('should throw error if type to augment is not present', function () {
		expect(ex.augment).withParams('nopet').to.throw(TypeError);
		expect(ex.augment).withParams('nopet')
				.to.throw('cannot augment nopet.prototype');
	});

	it('should throw error if type to unaugment is not present', function () {
		expect(ex.unaugment).withParams('nopet').to.throw(TypeError);
		expect(ex.unaugment).withParams('nopet')
				.to.throw('cannot unaugment nopet.prototype');
	});

	it('should throw error if type to augment is not a sub-object', function () {
		expect(ex.augment).withParams('augment').to.throw(TypeError);
		expect(ex.augment).withParams('augment')
				.to.throw('cannot augment augment.prototype');
	});

	it('should throw error if type to unaugment is not a sub-object', function () {
		expect(ex.unaugment).withParams('augment').to.throw(TypeError);
		expect(ex.unaugment).withParams('augment')
				.to.throw('cannot unaugment augment.prototype');
	});

	it('should augment the string prototype', function () {

		expect(ex.augment('String')).to.be.equal(String.prototype);
		expect(String.prototype).to.respondTo('charCodeAtEx');
	});

	it('should unaugment the string prototype', function () {

		expect(ex.augment('String')).to.be.equal(String.prototype);
		expect(String.prototype).to.respondTo('charCodeAtEx');

		expect(ex.unaugment('String')).to.be.equal(String.prototype);
		expect(String.prototype).to.not.respondTo('charCodeAtEx');
	});

	it('should throw if augmentation would overwrite existing method', function () {
		ex.augment('String');

		expect(ex.augment).withParams('String').to.throw(TypeError);
		expect(ex.augment).withParams('String')
				.to.throw('cannot augment String.prototype with method ' +
					'charAtEx as that would overwrite an existing method');
	});

	it('should be able to invoke method from a String object', function () {
		ex.augment('String');

		expect('exception'.charAtEx(1)).to.be.equal('x');
	});

	it('augment everything if no type specified', function () {
		ex.augment();

		expect('exception'.charAtEx(1)).to.be.equal('x');
	});
});
