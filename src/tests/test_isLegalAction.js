const isLegalAction = require('../logic/name.js');

const args = process.argv.slice(2);
const state = args[0];
const move = args[0];

console.log(isLegalAction(state, move));
