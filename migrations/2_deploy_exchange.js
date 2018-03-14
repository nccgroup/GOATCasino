global.artifacts = artifacts; 
global.web3 = web3;
const GOATConfig = require('../GOATlib/GOATConfig');

var CasinoExchange = global.artifacts.require("CasinoExchange");
var Lottery = global.artifacts.require("Lottery");

module.exports = async function(deployer, network, accounts) {
	await deployer.deploy(CasinoExchange, {from: GOATConfig.accounts.casinoOwner});
};
