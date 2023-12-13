var number = require('./')
  , assert = require('assert')
  , i = 0
  , ok = process.stdout.write.bind(process.stdout, "\n  \u2713 ok\n\n")

// .times
i = 0;
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

ok();