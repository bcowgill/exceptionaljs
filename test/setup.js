/*
    setup.js

    common setup for all test plans. test framework globals defined.

*/

/* jshint maxcomplexity: 2 */

'use strict';

global.chai = require('chai');
global.chai.use(require('sinon-chai'));

global.should = chai.should();
global.expect = chai.expect;
global.assert = chai.assert;
global.AssertionError = chai.AssertionError;
global.sinon = require('sinon');

global.swallow = function (thrower) {
    try {
        thrower();
    } catch (e) { }
};

global.testAsync = function (asyncDone, thrower) {
    var reasonForFailureIfAny;
    try {
        thrower();
    }
    catch (error) {
        reasonForFailureIfAny = new Error(error);
    }
    finally {
        asyncDone(reasonForFailureIfAny);
    }
};
