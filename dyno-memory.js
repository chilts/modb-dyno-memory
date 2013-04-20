// ----------------------------------------------------------------------------

var crypto = require('crypto');
var util = require('util');

var DynoAbstract = require('dyno-abstract');

// ----------------------------------------------------------------------------

var DynoMemory = function() {
    var self = this;

    // call the superclass
    DynoMemory.super_.call(this);

    // create our store
    self.store = {};

    return self;
};
util.inherits(DynoMemory, DynoAbstract);

// ----------------------------------------------------------------------------

// _putOperation(operationName, itemName, timestamp, operation, change, callback) -> (err)
//
// This replaces the entire item. It does not put individual attributes.
DynoMemory.prototype._putOperation = function(operationName, itemName, timestamp, change, callback) {
    var self = this;

    // create the data to store
    var data = {
        name      : itemName,
        operation : operationName,
        timestamp : timestamp,
        change    : change,
    };

    // see if this item already exists
    if ( self.store[itemName] ) {
        self.store[itemName].push(data);
    }
    else {
        // make a new one
        self.store[itemName] = [ data ];
    }

    console.log(util.inspect(self.store, false, null, true));

    // simulate IO
    process.nextTick(function() {
        callback(null);
    });
};

// _getChangesets(itemName, callback) -> (err, changesets)
//
// This retrieves all changesets for this item
DynoAbstract.prototype._getChangesets = function(itemName, callback) {
    var self = this;

    // To get all of the changesets, we just return the item (if it exists). We make a copy of it
    // so that it hasn't disappeared when we come back after nextTick()
    var item;
    if ( self.store[itemName] ) {
        // terrible way to clone
        item = JSON.parse(JSON.stringify(self.store[itemName]));
    }
    else {
        item = [];
    }

    // simulate IO
    process.nextTick(function() {
        callback(null, item);
    });
};

// ----------------------------------------------------------------------------

// the createDynoMemory() function
module.exports = exports = function createDynoMemory(filename) {
    return new DynoMemory(filename);
};

// ----------------------------------------------------------------------------
