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

// query(query) -> (err, items)
//
// query({ start : 'james', end : 'john' }, callback);
//
// This returns all the items between 'start' and 'end'.
DynoMemory.prototype.query = function(query, callback) {
    var self = this;

    // get all the keys in this store
    var keys = Object.keys(self.store).sort();

    // save the items which match the input query
    var items = [];
    keys.forEach(function(key, i) {
        // ignore this key if it is outside the range we want
        if ( query.start && key < query.start ) return;
        if ( query.end   && key > query.end   ) return;

        // ok, looks like we have an item
        var item = self.reduce(self.store[key]);
        items.push(item);
    });

    // return all the items we found
    callback(null, items);
};

// scan(field, value, callback) -> (err, items)
// scan(fn, callback) -> (err, items)
//
// scan('admin', true, callback);
// scan('favColour', 'red', callback);
//
// This scans through all the items in the DB and returns any that fulfil the criteria.
DynoMemory.prototype.scan = function(field, value, callback) {
    var self = this;

    var fn;
    if ( !callback && typeof field === 'function' ) {
        fn = field;
        callback = value;
        field = null
        value = null;
    }

    // get all the keys in this store
    var keys = Object.keys(self.store).sort();

    // save the items which match the input query
    var items = [];
    keys.forEach(function(key, i) {
        // we have an item, so flatten it first
        var item = self.reduce(self.store[key]);

        // only push this item if it fulfils the criteria
        if ( field && item.value[field] === value ) {
            items.push(item);
        }
        if ( fn && fn(item) ) {
            items.push(item);
        }
    });

    // return all the items we found
    callback(null, items);
};

// ----------------------------------------------------------------------------

// the createDynoMemory() function
module.exports = exports = function createDynoMemory(filename) {
    return new DynoMemory(filename);
};

// ----------------------------------------------------------------------------
