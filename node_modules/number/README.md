number
====

Number utility functions. Inspired by the ruby Integer object.

[![build status](https://secure.travis-ci.org/jwerle/number.png)](http://travis-ci.org/jwerle/number)
[![testling badge](https://ci.testling.com/jwerle/number.png)](https://ci.testling.com/jwerle/number)

## install

*node*

```sh
$ npm install --save number
```

*component*

```sh
$ component install --save jwerle/number
```

*bower*

```sh
$ bower install number
```

*browser*

```html
<script type="text/javascript" src="https://raw.github.com/jwerle/number/master/build/build.js"></script>
<script type="text/javascript">
  var number = require('number');
</script>
```

## usage

```js
var number = require('number');

var i = 0;
(4).times(function (n) { i = n; });
assert(i === 3);

// .downto
(5).downto(1, function (n) { i = n });
assert(i === 1);

// .upto
(5).upto(10, function (n) { i = n });
assert(i === 10);

// .next
assert((5).next === 6);

// .even
assert((1).even === false);
assert((2).even === true);

// .odd
assert((3).odd === true);
assert((4).odd === false);

// .pred
assert((3).pred === 2);
assert((4).pred === 3);
```

## api

### .extend(name, isGetter, fn)

You can extend the `Number` prototype with `number.extend()`

* `name` - A string name of the function being added to the `Number` prototype
* `isGetter` - A `Boolean` indicating whether the `fn` handle is a getter function
* `fn` - A function handle to add to the `Number` prototype

***example***

Setter the `isGetter` flag to `true` will define the property as a getter:

```js
number.extend('sqrt', true, function () {
  return Math.sqrt(this);
});

console.log((4).sqrt); // 2
```

We can create a function that calculates the GCD (Greatest Common Divisor:

```js
number.extend('gcd', function (y) {
  var x = this
  y = y || 0;
  while (y != 0) {
    var z = x % y;
    x = y;
    y = z;
  }
  
  return Math.abs(x);
});

(3).gcd(-7); // 1
```
  
## license

MIT