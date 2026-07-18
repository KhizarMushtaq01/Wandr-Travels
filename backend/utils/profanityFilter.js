const Filter = require('bad-words');

const filter = new Filter();

function containsProfanity(text) {
  if (!text) return false;
  return filter.isProfane(text);
}

module.exports = { containsProfanity };
