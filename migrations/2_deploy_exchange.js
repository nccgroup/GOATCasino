global.artifacts = artifacts; 
global.web3 = web3;
const GOATConfig = require('../GOATlib/GOATConfig');

var CasinoExchange = global.artifacts.require("CasinoExchange");
var Lottery = global.artifacts.require("Lottery");

module.exports = function(deployer, network, accounts) {
	//deploy Exchange, which also deploys the token contract
	return deployer.deploy(CasinoExchange, {from: GOATConfig.accounts.casinoOwner});
};
