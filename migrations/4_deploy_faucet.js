global.artifacts = artifacts; 
global.web3 = web3;
const GOATConfig = require('../GOATlib/GOATConfig');

var CasinoExchange = global.artifacts.require("CasinoExchange");
var CasinoToken = global.artifacts.require("CasinoToken");
var Faucet = global.artifacts.require("Faucet");

module.exports = async function(deployer, network, accounts) {
	await deployer.deploy(Faucet, {from: GOATConfig.accounts.casinoOwner});
	FaucetInstance = await Faucet.deployed()

	var CasinoExchangeInstance = await CasinoExchange.deployed();
	CasinoTokenAddress = await CasinoExchangeInstance.casinoToken.call();
	CasinoTokenInstance = CasinoToken.at(CasinoTokenAddress);

	await FaucetInstance.initFaucet.sendTransaction(CasinoTokenAddress, {from: GOATConfig.accounts.casinoOwner})

	await CasinoTokenInstance.transfer.sendTransaction(FaucetInstance.address, 10**19, {from: GOATConfig.accounts.casinoOwner})

};
