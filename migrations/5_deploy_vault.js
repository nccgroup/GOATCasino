global.artifacts = artifacts; 
global.web3 = web3;
const GOATConfig = require('../GOATlib/GOATConfig');

crypto = require('crypto');

var CasinoExchange = global.artifacts.require("CasinoExchange");
var CasinoToken = global.artifacts.require("CasinoToken");
var Vault = global.artifacts.require("Vault");

module.exports = async function(deployer, network, accounts) {

	var reward = 10**19
	//deploy vault
	return deployer.deploy(Vault, {from: GOATConfig.accounts.casinoOwner}).then(function(){
		//get deployed exchange
		return CasinoExchange.deployed()
	}).then(function(CasinoExchangeInstance){
		//ask exchange where the token contract is
		return CasinoExchangeInstance.casinoToken.call()
	}).then(function(CasinoTokenAddress){
		//get instance of deployed token contract
		CasinoTokenInstance = CasinoToken.at(CasinoTokenAddress)

		//wait for the vault to be deployed
		return Vault.deployed().then( function(VaultInstance){
			//approve vault to spend claim reward tokens
			CasinoTokenInstance.approve.sendTransaction(VaultInstance.address, reward, {from: GOATConfig.accounts.casinoOwner}).then(function(){
				//initialize vault with random password and reward amount
				var password = crypto.randomBytes(16).toString('hex')
				return VaultInstance.initVault.sendTransaction(CasinoTokenAddress, reward, web3.fromAscii(password), {from: GOATConfig.accounts.casinoOwner})
			})
		})
	})




};
