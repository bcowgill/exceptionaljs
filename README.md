# exceptionaljs

Provides alternate core Javascript methods which throw exceptions instead of error codes as suggested in Clean Code by Robert C. Martin

You can mix these methods in to the prototypes or can simply call them from the module's exported object.

    const ex = require('exceptional').exceptional;
    
    ex.String.indexOf(string, mandatoryText); // throws if mandatoryText not found.
    
    ex.augment('String'); // augment String.prototype with exception throwing functions.

    string.indexOfEx(mandatoryText);
    
    ex.unaugment(); // unaugment all prototypes with exception throwing functions.

## Motivation

"Prefer Exceptions to Returning Error Codes", Clean Code, Robert C. Martin, p46

Returning error codes from command functions is a subtle violation of command query separation.
It promotes commands being used as expressions in the predicates of if statements.

    if (string.indexOf(mandatoryText) === -1)

This does not suffer from verb/adjective confusion but does lead to deeply nested structures.
When you return an error code, you create the problem that the caller must deal with the error immediately.

    if (string.indexOf(mandatoryText) === -1) {
        if (processCommand(string) === null) {
            if (...) {
                ...
            }
            else {
                console.error('unable to ...');
            }            
        }
        else {
            console.error('unable to run command');
        }
    }
    else {
        console.error('mandatory text not present');
        return -1;
    }
    return string;


On the other hand, if you use exceptions instead of returned error codes, then the error processing code can be separated from the happy path code and can be simplified.

    try {
        string.indexOfEx(mandatoryText);
        processCommand(string);
        ...
    }
    catch (exception) {
        console.error(exception);
    }
    finally {
        ...
    }


## Pre-requisites

TODO

## License

Unlicense see LICENCE file or http://unlicense.org

## Setup

In the project directory, launch:

    sudo npm install -g jshint grunt node-inspector
    npm install

You'll need to do this once or when dependencies change.

## Test

Jshint checking and tests:

    npm run pretest

    npm test

or peruse the **Gruntfile.js** for other development related tasks like watching, and test coverage

Test Driven Development:

    grunt tdd --watch test
   
Will re-run the tests on every code change, but will not JSHINT so make sure you
do a normal grunt before committing your code.

Code Coverage:

    grunt or grunt coverage
    npm run coverage-view
    npm run covereach

The grunt command will generate code coverage which you can view in the browser.
We will set coverage points quite high and the build will fail if they are not met.

The covereach command will run each test plan individually and show coverage. The
module under test should be as close to 100% covered by the single test plan as is possible.

## Debugging

To visually debug without an IDE install node-inspector and use the Chrome
or Opera debugger to debug your code.

    npm run debugger
    npm run debuggertest




.
