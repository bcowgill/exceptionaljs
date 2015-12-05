// js-exceptions-test.js
'use strict';
/*global describe, it */

var chai = require('chai'),
//	should = chai.should(),
	expect = chai.expect,
	ex = require('../lib/exceptional').exceptional,
	s = ex.String;

describe('augment()', function () {

	afterEach(function () {
		ex.unaugment();
	});

	it('should throw error if type to augment is not present', function () {
		var fnTest = function () {
			ex.augment('nopet');
		};

		expect(fnTest).to.throw(TypeError);
		expect(fnTest).to.throw('cannot augment nopet.prototype');
	});

	it('should throw error if type to unaugment is not present', function () {
		var fnTest = function () {
			ex.unaugment('nopet');
		};

		expect(fnTest).to.throw(TypeError);
		expect(fnTest).to.throw('cannot unaugment nopet.prototype');
	});

	it('should throw error if type to augment is not a sub-object', function () {
		var fnTest = function () {
			ex.augment('augment');
		};

		expect(fnTest).to.throw(TypeError);
		expect(fnTest).to.throw('cannot augment augment.prototype');
	});

	it('should throw error if type to unaugment is not a sub-object', function () {
		var fnTest = function () {
			ex.unaugment('augment');
		};

		expect(fnTest).to.throw(TypeError);
		expect(fnTest).to.throw('cannot unaugment augment.prototype');
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

		var fnTest = function () {
			ex.augment('String');
		};
		fnTest();

		expect(fnTest).to.throw(TypeError);
		expect(fnTest).to.throw('cannot augment String.prototype with method ' +
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

describe('String methods', function () {
	var method = 'charAt';
	describe(method + '()', function () {
		var fn = '' + method;

		it('should answer with character within range', function () {
			expect(s[fn]('exceptional', 1)).to.be.equal('x');
		});

		it('should throw exception if negative', function () {
			expect(function () {
				s[fn]('exceptional', -1);
			}).to.throw(RangeError);

			expect(function () {
				s[fn]('exceptional', -1);
			}).to.throw('position given is outside the string: -1');
		});

		it('should throw exception if past end of string', function () {
			expect(function () {
				s[fn]('', 1);
			}).to.throw(RangeError);

			expect(function () {
				s[fn]('', 1);
			}).to.throw('position given is outside the string: 1');
		});
	});

	method = 'charCodeAt';
	describe(method + '()', function () {
		var fn = '' + method;

		it('should answer with character code within range', function () {
			expect(s[fn]('exceptional', 1)).to.be.equal('x'.charCodeAt(0));
		});

		it('should throw exception if negative', function () {
			var doit = function () {
				s[fn]('exceptional', -1);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('position given is outside the string: -1');
		});

		it('should throw exception if past end of string', function () {
			var doit = function () {
				s[fn]('', 1);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('position given is outside the string: 1');
		});
	});

	method = 'indexOf';
	describe(method + '()', function () {
		var fn = '' + method;

		it('should answer with position of string', function () {
			expect(s[fn]('exceptional', 'cep')).to.be.equal(2);
		});

		it('should throw exception if not found in string', function () {
			var doit = function () {
				s[fn]('exceptional', 'not');
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('string not found within target string: not');
		});
	});

	method = 'lastIndexOf';
	describe(method + '()', function () {
		var fn = '' + method;

		it('should answer with position of string', function () {
			expect(s[fn]('exceptional', 'e')).to.be.equal(3);
		});

		it('should throw exception if not found in string', function () {
			var doit = function () {
				s[fn]('exceptional', 'not');
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('string not found within target string: not');
		});
	});

	method = 'match';
	describe(method + '()', function () {
		var fn = '' + method;

		it('should answer with array of matches', function () {
			expect(s[fn]('exceptional', /e/g)).to.be.deep.equal(['e', 'e']);
		});

		it('should throw exception if not found in string', function () {
			var doit = function () {
				s[fn]('exceptional', /not/g);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('regex not found within target string: /not/g');
		});
	});

	method = 'replace';
	describe(method + '()', function () {
		var fn = '' + method;

		it('should answer with replaced simple string', function () {
			expect(s[fn]('exceptional', /e/g, 'E')).to.be.deep.equal('ExcEptional');
		});

		// flags not supported in V8 core (Chrome and node.js)
		it.skip('should answer with replaced simple string given flags', function () {
			expect(s[fn]('exceptional', /e/, 'E', 'g')).to.be.deep.equal('ExcEptional');
		});

		it('should answer with replaced string using an editor function', function () {
			function editor (match) {
				return match.toUpperCase() + '' + match;
			}
			expect(s[fn]('exceptional', /e/g, editor)).to.be.deep.equal('EexcEeptional');
		});

		it('should throw exception if not found in string', function () {
			var doit = function () {
				s[fn]('exceptional', /not/g, 'NOT');
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('regex not found within target string: /not/g');
		});

		it('should throw exception if not found in string using an editor function', function () {
			var doit = function () {
				s[fn]('exceptional', /not/g, function () {
					return arguments.join('/');
				});
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('regex not found within target string: /not/g');
		});
	});

	method = 'search';
	describe(method + '()', function () {
		var fn = '' + method;

		it('should answer with position of string', function () {
			expect(s[fn]('exceptional', /CEP/i)).to.be.equal(2);
		});

		it('should throw exception if not found in string', function () {
			var doit = function () {
				s[fn]('exceptional', /not/i);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('regex not found within target string: /not/i');
		});
	});

	method = 'slice';
	describe(method + '()', function () {
		var fn = '' + method;

		it('should answer with a slice until end of the string', function () {
			expect(s[fn]('exceptional', 3)).to.be.equal('eptional');
		});

		it('should answer with a slice from start of the string', function () {
			expect(s[fn]('exceptional', 0, -2)).to.be.equal('exception');
		});

		it('should answer with a slice inside of the string', function () {
			expect(s[fn]('exceptional', 1, -2)).to.be.equal('xception');
		});

		it('should throw exception if slice length is zero', function () {
			var doit = function () {
				s[fn]('exceptional', 2, 2);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('slice endpoints return nothing from the string');
		});

		it('should throw exception if starts outside the length of the string', function () {
			var doit = function () {
				s[fn]('exceptional', 11, -2);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('beginSlice position is outside the string: 11');
		});

		it('should throw exception if starts outside the length of the string, ' +
				'negative', function () {
			var doit = function () {
				s[fn]('exceptional', -12, -2);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('beginSlice position is outside the string: -12');
		});

		it('should throw exception if ends outside the length of the string', function () {
			var doit = function () {
				s[fn]('exceptional', 2, 11);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('endSlice position is outside the string: 11');
		});

		it('should throw exception if ends outside the length of the string, ' +
				'negative', function () {
			var doit = function () {
				s[fn]('exceptional', 2, -12);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('endSlice position is outside the string: -12');
		});

		it('should throw exception if start is after end position', function () {
			var doit = function () {
				s[fn]('exceptional', 5, 2);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('slice endpoints return nothing from the string');
		});

		it('should throw exception if start is after end position, negative', function () {
			var doit = function () {
				s[fn]('exceptional', 2, -10);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('slice endpoints return nothing from the string');
		});

		it('should throw exception if start is after end position, both negative', function () {
			var doit = function () {
				s[fn]('exceptional', -4, -6);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('slice endpoints return nothing from the string');
		});

	});

});
