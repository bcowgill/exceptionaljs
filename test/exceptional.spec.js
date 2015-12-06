// exceptional.spec.js
'use strict';

var	ex = require('../lib/exceptional').exceptional,
	s = ex.String;

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
			}).to.throw('charAtEx() index argument <-1> must be between 0 and 10');
		});

		it('should throw exception if past end of string', function () {
			expect(function () {
				s[fn]('', 1);
			}).to.throw(RangeError);

			expect(function () {
				s[fn]('', 1);
			}).to.throw('charAtEx() index argument <1> must be between 0 and 0');
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
			expect(doit).to.throw('charCodeAtEx() index argument <-1> must be between 0 and 10');
		});

		it('should throw exception if past end of string', function () {
			var doit = function () {
				s[fn]('', 1);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('charCodeAtEx() index argument <1> must be between 0 and 0');
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

	method = 'split';
	describe(method + '()', function () {
		var fn = '' + method;

		it('should answer with an array of characters if given empty split pattern', function () {
			expect(s[fn]('exceptional', '')).to.be.deep.equal([
				'e', 'x', 'c', 'e', 'p', 't', 'i', 'o', 'n', 'a', 'l'
			]);
		});

		it('should answer with a limited array of characters if given empty ' +
				'split pattern', function () {
			expect(s[fn]('exceptional', '', 5)).to.be.deep.equal([
				'e', 'x', 'c', 'e', 'p'
			]);
		});

		it('should answer with one value only if you specify a limit', function () {
			expect(s[fn]('exceptional', '', 1)).to.be.deep.equal([
				'e'
			]);
		});

		it('should throw an error if there is nothing to split', function () {
			var doit = function () {
				s[fn]('');
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('split separator not found in string: undefined');
		});

		it('should throw an error if there is no split pattern in the string', function () {
			var doit = function () {
				s[fn]('only one entry', /\s*,\s*/);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('split separator not found in string: /\\s*,\\s*/');
		});
	});

	method = 'substr';
	describe(method + '()', function () {
		var fn = '' + method;

		it('should answer with a substr until end of the string', function () {
			expect(s[fn]('exceptional', 3)).to.be.equal('eptional');
		});

		it('should answer with a substr from start of the string', function () {
			expect(s[fn]('exceptional', 0, 9)).to.be.equal('exception');
		});

		it('should answer with a substr inside of the string', function () {
			expect(s[fn]('exceptional', 1, 8)).to.be.equal('xception');
		});

		it('should answer with a substr from the end of the string', function () {
			expect(s[fn]('exceptional', -3, 2)).to.be.equal('na');
		});

		it('should throw exception if starts outside the length of the string', function () {
			var doit = function () {
				s[fn]('exceptional', 11, -2);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('start position is outside the string: 11');
		});

		it('should throw exception if starts outside the length of the string, ' +
				'negative', function () {
			var doit = function () {
				s[fn]('exceptional', -12, -2);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('start position is outside the string: -12');
		});

		it('should throw exception if ends outside the length of the string', function () {
			var doit = function () {
				s[fn]('exceptional', 2, 11);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('start and length combination lie outside the string: 2, 11');
		});

		it('should throw exception if ends outside the length of the string from end', function () {
			var doit = function () {
				s[fn]('exceptional', -2, 8);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('start and length combination lie outside the string: -2, 8');
		});

		it('should throw exception if length is zero', function () {
			var doit = function () {
				s[fn]('exceptional', 2, 0);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('length cannot be less than one: 0');
		});

		it('should throw exception if length is negative', function () {
			var doit = function () {
				s[fn]('exceptional', 2, -6);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('length cannot be less than one: -6');
		});
	});

	method = 'substring';
	describe(method + '()', function () {
		var fn = '' + method;

		it('should answer with a substring until end of the string', function () {
			expect(s[fn]('exceptional', 3)).to.be.equal('eptional');
		});

		it('should answer with a substring from start of the string', function () {
			expect(s[fn]('exceptional', 0, 9)).to.be.equal('exception');
		});

		it('should answer with a substring from start of the string ' +
				'start > end is ok', function () {
			expect(s[fn]('exceptional', 9, 0)).to.be.equal('exception');
		});

		it('should answer with a substring inside of the string', function () {
			expect(s[fn]('exceptional', 1, 9)).to.be.equal('xception');
		});

		it('should answer with a substring including the whole string', function () {
			expect(s[fn]('exceptional', 0, 11)).to.be.equal('exceptional');
		});

		it('should throw exception if substring length is zero', function () {
			var doit = function () {
				s[fn]('exceptional', 2, 2);
			};

			expect(doit).to.throw(ReferenceError);
			expect(doit).to.throw('substringEx() beginIndex and endIndex ' +
					'get nothing from the string');
		});

		it('should throw exception if starts outside the length of the string', function () {
			var doit = function () {
				s[fn]('exceptional', 11, 12);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('substringEx() beginIndex argument <11> ' +
				'must be between 0 and 10');
		});

		it('should throw exception if starts outside the length of the string, ' +
				'negative', function () {
			var doit = function () {
				s[fn]('exceptional', -12, 2);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('substringEx() beginIndex argument <-12> ' +
				'must be between 0 and 10');
		});

		it('should throw exception if ends outside the length of the string', function () {
			var doit = function () {
				s[fn]('exceptional', 2, 12);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('substringEx() endIndex argument <12> must be between 0 and 11');
		});

		it('should throw exception if ends outside the length of the string, ' +
				'negative', function () {
			var doit = function () {
				s[fn]('exceptional', 2, -12);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('substringEx() endIndex argument <-12> must be between 0 and 11');
		});

		it('should throw exception if start is after end position, negative', function () {
			var doit = function () {
				s[fn]('exceptional', 2, -10);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('substringEx() endIndex argument <-10> must be between 0 and 11');
		});

		it('should throw exception if start is after end position, both negative', function () {
			var doit = function () {
				s[fn]('exceptional', -4, -6);
			};

			expect(doit).to.throw(RangeError);
			expect(doit).to.throw('substringEx() beginIndex argument <-4> ' +
				'must be between 0 and 10');
		});

	});
});
