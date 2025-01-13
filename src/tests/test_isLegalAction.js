const isLegalAction = require('../logic/isLegalAction.js');

const args = process.argv.slice(2);
const state = args[0];
const move = args[1];

console.log(isLegalAction(state, move));
