'use strict';

function validate(fn) {
  return function validateInner() {
    const args = Array.prototype.slice.call(arguments);

    let options;
    do {
      options = args.shift();
    } while (typeof options === 'string');

    fn(options, args[0]);
  };
}

module.exports = validate;

