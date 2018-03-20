global.artifacts = artifacts; 
global.web3 = web3;
const GOATConfig = require('../GOATlib/GOATConfig');

crypto = require('crypto');

var CasinoExchange = global.artifacts.require("CasinoExchange");
var CasinoToken = global.artifacts.require("CasinoToken");
var Vault = global.artifacts.require("Vault");

module.exports = async function(deployer, network, accounts) {

	var reward = 10**19

	await deployer.deploy(Vault, {from: GOATConfig.accounts.casinoOwner});

	var CasinoExchangeInstance = await CasinoExchange.deployed();
	CasinoTokenAddress = await CasinoExchangeInstance.casinoToken.call();
	CasinoTokenInstance = CasinoToken.at(CasinoTokenAddress);

	VaultInstance = await Vault.deployed()

	await CasinoTokenInstance.approve.sendTransaction(VaultInstance.address, reward, {from: GOATConfig.accounts.casinoOwner})

	password = crypto.randomBytes(32)

	await VaultInstance.initVault.sendTransaction(CasinoTokenAddress, reward, password.toString(), {from: GOATConfig.accounts.casinoOwner})


};
