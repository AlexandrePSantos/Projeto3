/**
 * Module dependencies
 */

var define = Object.defineProperty
	,	noop = Function()

/**
 * Exports
 */
var number = module.exports = {};


/**
 * Extends the `Number` prototype
 *
 * @api public
 * @function number.extend
 * @param {String} name
 * @param {Function} fn
 */

number.extend = function (name, isGetter, fn) {
	fn = (typeof isGetter === 'function')? isGetter : fn;
	isGetter = (isGetter === true)? true : false;

	define(Number.prototype, name, {
		configurable: false,
		enumerable: false,
		get: isGetter? fn : function () { return fn },
		set: noop
	});

	return this;
};


/**
 * Iterates a function `n` times
 *
 * @function Number#times
 * @api public
 * @param {Function} fn
 */

number.extend('times', function (fn) { 
  for (var i = 0; i < this; ++i) fn(i);
  return this;
});

/**
 * Iterates a function, passing increasing
 * values from `n` up to and including `limit`
 *
 * @function Number#upto
 * @api public
 * @param {Function} limit
 * @param {Function} fn
 */

number.extend('upto', function (limit, fn) { 
  for (var i = 0; i <= limit; ++i) fn(i);
  return this;
});

/**
 * Iterates a function, passing decreasing
 * values from `n` down to and including `limit`
 *
 * @function Number#downto
 * @api public
 * @param {Function} limit
 * @param {Function} fn
 */

number.extend('downto', function (limit, fn) {
	for (var i = this; i >= limit; i--) fn(i);
  return this;
});

/**
 * Returns a number equal to `n + 1`
 *
 * @function Number#next
 * @api public
 */

number.extend('next', true, function () { 
  return this + 1;
});

/**
 * Returns a number equal to `n - 1`
 *
 * @function Number#pred
 * @api public
 */

number.extend('pred', true, function () { 
  return this - 1;
});

/**
 * Returns `true` if `n` is even
 *
 * @function Number#even
 * @api public
 */

number.extend('even', true, function () { 
  return !(this % 2);
});

/**
 * Returns `true` if `n` is odd
 *
 * @function Number#odd
 * @api public
 */

number.extend('odd', true, function () { 
  return !!(this % 2);
});
