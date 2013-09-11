// ----------------------------------------------------------------------------
//
// test-runner.js - run all the modb-dyno-abstract tests
//
// Copyright (c) 2013 Andrew Chilton
//
// * andychilton@gmail.com
// * http://chilts.org/
//
// ----------------------------------------------------------------------------

var dyno = require('./modb-dyno-memory.js');

function newDyno() {
    return dyno();
};

// ok, pass this function to the tests
var tests = require('modb-dyno-abstract/tests.js');
tests(newDyno);

// ----------------------------------------------------------------------------
