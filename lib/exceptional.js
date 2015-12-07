// exceptional.js
// standard javascript functions which throw errors instead of return codes
/* global window */
/* jshint maxparams: 5 */

(function(exports, global) {
	'use strict';

//	var debug = require('debug')('exceptional');

	function _methodNamesOf (object) {
		var keys = [];
		Object.keys(object).forEach(function (type) {
			if (type.match(/^[a-z]/i) && 'function' === typeof object[type]) {
				keys.push(type);
			}
		});
		return keys.sort();
	}

	function _objectNamesOf (object) {
		var keys = [];
		Object.keys(object).forEach(function (type) {
			if (type.match(/^[a-z]/i) && 'object' === typeof object[type]) {
				keys.push(type);
			}
		});
		return keys.sort();
	}

	function _makeInstanceMethod (handler) {
		var method = function () {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(this);
			return handler.apply(null, args);
		};
		return method;
	}

	function _makeStaticMethod (handler) {
		var method = function () {
			var args = Array.prototype.slice.call(arguments);
			return handler.apply(null, args);
		};
		return method;
	}

	function _targetObjectOf (name) {
		var maker = {
			makeMethod: _makeStaticMethod
		};
		if (name === 'global') {
			maker.target = global;
		}
		else if (name === 'Math') {
			maker.target = Math;
		}
		else {
			maker.target = global[name].prototype;
			maker.makeMethod = _makeInstanceMethod;
		}
		return maker;
	}

	var self = exports.exceptional = {

		'augment': function (typeName) {
			/* jshint maxcomplexity: 5 */
			if (!typeName) {
				_objectNamesOf(exports.exceptional).forEach(function (type) {
					exports.exceptional.augment(type);
				});
				return;
			}

			if (typeName === 'window') {
				typeName = 'global';
			}

			var maker, methods = exports.exceptional[typeName];
			if ('object' !== typeof methods) {
				throw new TypeError('cannot augment ' + typeName +
					'.prototype with non-object: ' + typeof methods);
			}

			maker = _targetObjectOf(typeName);
			_methodNamesOf(methods).forEach(function (method) {
				var _super = method + 'Ex';

				//debug('attach ', typeName, _super, _super in maker.target);
				if (maker.target.hasOwnProperty(_super)) {
					throw new TypeError('cannot augment ' + typeName +
							'.prototype with method ' + _super +
							' as that would overwrite an existing method');
				}
				maker.target[_super] = maker.makeMethod(methods[method]);
			});
			return maker.target;
		},

		'unaugment': function (typeName) {
			/* jshint maxcomplexity: 5 */
			if (!typeName) {
				_objectNamesOf(exports.exceptional).forEach(function (type) {
					exports.exceptional.unaugment(type);
				});
				return;
			}

			if (typeName === 'window') {
				typeName = 'global';
			}

			var maker, methods = exports.exceptional[typeName];
			if ('object' !== typeof methods) {
				throw new TypeError('cannot unaugment ' + typeName +
					'.prototype');
			}

			maker = _targetObjectOf(typeName);
			_methodNamesOf(methods).forEach(function (method) {
				var _super = method + 'Ex';

				//debug('delete ', typeName, _super, _super in maker.target);
				if (_super in maker.target) {
					delete maker.target[_super];
				}
			});
			return maker.target;
		},

		'TypeError': {
			throw: function (value, type, param, method) {
				method = method? (method + '() ') : '';
				param = param? (param + ' ') : '';
				throw new TypeError(method + param + 'argument <' + value +
					'> must be ' + type);
			},
		},

		'RangeError': {
			throw: function (value, type, param, method) {
				method = method? (method + '() ') : '';
				param = param? (param + ' ') : '';
				throw new RangeError(method + param + 'argument <' + value +
						'> must be ' + type);
			},

			throwIfInvalid: function (value, param, method) {
				/* jshint maxcomplexity: 7 */
				var message, Type;
				if (typeof value !== 'number') {
					Type = TypeError;
					message = '> must be a finite number';
				}
				else if (typeof value !== 'number' || !isFinite(value)) {
					Type = RangeError;
					message = '> must be a finite number';
				}
				if (Type) {
					method = method? (method + '() ') : '';
					param = param? (param + ' ') : '';
					throw new Type(method + param +
						'argument <' + value + message);
				}
				return value;
			},

			throwIfOutOfRange: function (value, min, max, param, method) {
				/* jshint maxcomplexity: 10 */
				var message;

				self.RangeError.throwIfInvalid(value, param, method);
				if ((min === void 0 || min === null) && value > max) {
					message = '> must be at most ' + max;
				}
				else if ((max === void 0 || max === null) && value < min) {
					message = '> must be at least ' + min;
				}
				else if (value < min || value > max) {
					message = '> must be between ' + min + ' and ' + max;
				}
				if (message) {
					method = method? (method + '() ') : '';
					param = param? (param + ' ') : '';
					throw new RangeError(method + param +
						'argument <' + value + message);
				}
				return value;
			},

			throwIfNotGreaterThan: function (value, floor, param, method) {
				self.RangeError.throwIfInvalid(value, param, method);
				if (value <= floor) {
					method = method? (method + '() ') : '';
					param = param? (param + ' ') : '';
					throw new RangeError(method + param +
							'argument <' + value + '> must be greater than ' + floor);
				}
				return value;
			}
		},

		global: {
			parseFloat: function (string) {
				var value = parseFloat(string);
				if (isNaN(value)) {
					self.TypeError.throw(string, 'a string representing a ' +
							'floating point number', 'string', 'parseFloatEx');
				}
				if (!isFinite(value)) {
					self.RangeError.throw(value, 'a string representing a ' +
							'finite floating point number', 'string', 'parseFloatEx');
				}
				return value;
			},

			parseInt: function (string, radix) {
				var value = parseInt(string, radix);
				self.RangeError.throwIfOutOfRange(radix, 2, 36, 'radix', 'parseIntEx');
				if (isNaN(value)) {
					self.TypeError.throw(string, 'a string representing an ' +
							'integer number', 'string', 'parseIntEx');
				}
				return value;
			},

			isNaN: function (value) {
				if (isNaN(value)) {
					throw new RangeError('Not a Number (NaN)');
				}
				return value;
			},

			isFinite: function (value) {
				if (!isFinite(value)) {
					throw new RangeError('Not a finite number <' + value + '>');
				}
				return value;
			},

			'-': '-'
		},

		'String': {
			charAt: function (str, index) {
				self.RangeError.throwIfOutOfRange(index, 0,
					Math.max(0, str.length - 1), 'index', 'charAtEx');
				return str.charAt(index);
			},

			charCodeAt: function (str, index) {
				self.RangeError.throwIfOutOfRange(index, 0,
					Math.max(0, str.length - 1), 'index', 'charCodeAtEx');
				return str.charCodeAt(index);
			},

			indexOf: function (str, find) {
				var where = str.indexOf(find);
				if (-1 === where) {
					throw new ReferenceError('indexOf() find argument <' +
						find + '> not found within target string');
				}
				return where;
			},

			lastIndexOf: function (str, find) {
				var where = str.lastIndexOf(find);
				if (-1 === where) {
					throw new ReferenceError('lastIndexOf() find argument <' +
						find + '> not found within target string');
				}
				return where;
			},

			match: function (str, regex) {
				var matches = str.match(regex);
				if (!matches) {
					throw new ReferenceError('matchEx() regex argument <' +
						regex + '> not found within target string');
				}
				return matches;
			},

			replace: function (str, regex, replace, flags) {
				var matched = false,
					fnReplace = typeof replace === 'function' ?
						function () {
							matched = true;
							return replace.apply(this, arguments);
						} :
						function () {
							matched = true;
							return replace;
						},
					replacement = str.replace(regex, fnReplace, flags);

				if (!matched) {
					throw new ReferenceError('replaceEx() regex argument <' +
						regex + '> not found within target string');
				}
				return replacement;
			},

			search: function (str, regex) {
				var where = str.search(regex);
				if (-1 === where) {
					throw new ReferenceError('searchEx() regex argument <' +
						regex + '> not found within target string');
				}
				return where;
			},

			slice: function (str, beginSlice, endSlice) {
				/* jshint maxcomplexity: 6 */
				var max = Math.max(0, str.length - 1);
				self.RangeError.throwIfOutOfRange(beginSlice, -str.length,
					max, 'beginSlice', 'sliceEx');
				if (endSlice !== void 0 && endSlice !== null) {
					self.RangeError.throwIfOutOfRange(endSlice, -str.length,
						max, 'endSlice', 'sliceEx');
				}

				var slice = str.slice(beginSlice, endSlice);
				if (slice === '') {
					throw new ReferenceError('sliceEx() endpoints return nothing ' +
						'from the string');
				}
				return slice;
			},

			split: function (str, separator, limit) {
				var split = str.split(separator, limit);
				if (split.length < 1 || split.length === 1 && limit !== 1) {
					throw new ReferenceError('splitEx() separator argument <'
						+ separator + '> not found in string');
				}
				return split;
			},

			substr: function (str, start, length) {
				/* jshint maxcomplexity: 6 */
				var max = Math.max(0, str.length - 1);
				self.RangeError.throwIfOutOfRange(start, -str.length,
					max, 'start', 'substrEx');
				max = Math.max(1, str.length);
				if (length !== void 0 && length !== null) {
					self.RangeError.throwIfOutOfRange(length, 1,
							max, 'length', 'substrEx');
				}

				var substr = str.substr(start, length);
				if (substr === '') {
					throw new ReferenceError('substrEx() length argument ' +
						'references nothing from the string: ' + length);
				}
				if (length && substr.length !== length) {
					throw new ReferenceError('substrEx() start and length ' +
						'argument combination lies outside the string: ' +
							start + ', ' + length);
				}
				return substr;
			},

			substring: function (str, beginIndex, endIndex) {
				var max = Math.max(0, str.length - 1);
				self.RangeError.throwIfOutOfRange(beginIndex, 0,
					max, 'beginIndex', 'substringEx');
				max += 1;
				if (endIndex === void 0 || endIndex === null) {
					endIndex = max;
				}
				self.RangeError.throwIfOutOfRange(endIndex, 0,
					max, 'endIndex', 'substringEx');

				var substring = str.substring(beginIndex, endIndex);
				if (substring === '') {
					throw new ReferenceError('substringEx() endIndex argument ' +
						'references nothing from the string ' + endIndex);
				}
				return substring;
			},

			'-': '-'
		},

		Math: {
			acos: function (value) {
				var result = Math.acos(value);
				if (!isFinite(result)) {
					self.RangeError.throwIfOutOfRange(value, -1, 1, 'value', 'acosEx');
				}
				return result;
			},

			asin: function (value) {
				var result = Math.asin(value);
				if (!isFinite(result)) {
					self.RangeError.throwIfOutOfRange(value, -1, 1, 'value', 'asinEx');
				}
				return result;
			},

			sqrt: function (value) {
				var result = Math.sqrt(value);
				if (isNaN(result)) {
					self.RangeError.throwIfOutOfRange(value, 0, null,  'value', 'sqrtEx');
				}
				return result;
			},

			log: function (value) {
				var result = Math.log(value);
				if (!isFinite(result)) {
					self.RangeError.throwIfNotGreaterThan(value, 0,  'value', 'logEx');
				}
				return result;
			},

			pow: function (base, exponent) {
				self.RangeError.throwIfInvalid(base, 'base', 'powEx');
				self.RangeError.throwIfInvalid(exponent, 'exponent', 'powEx');
				var result = Math.pow(base, exponent);
				self.global.isNaN(result);
				self.global.isFinite(result);
				return result;
			},

			'-': '-'
		},

		'-': '-'
	};
})(typeof module === 'object' && typeof module.exports === 'object' ?
		module.exports : window, typeof global === 'object' ? global: window);
