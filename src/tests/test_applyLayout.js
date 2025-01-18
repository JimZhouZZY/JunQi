const JunqiGame = require('../logic/junqiLogic.js');

const args = process.argv.slice(2);
const state = args[0];
const layout = args[1];

junqi_game = new JunqiGame(state);
junqi_game.applyLayout(layout);
const jzn = junqi_game.getJzn();

console.log(jzn);
