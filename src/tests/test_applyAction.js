const { isLegalAction, applyAction } = require('../logic/junqiLogic.js');

const args = process.argv.slice(2);
const state = args[0];
const move = args[1];

console.log(applyAction(state, move));
