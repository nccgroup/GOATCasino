global.artifacts = artifacts; 
global.web3 = web3;
const GOATConfig = require('../GOATlib/GOATConfig');

var CasinoExchange = global.artifacts.require("CasinoExchange");
var CasinoToken = global.artifacts.require("CasinoToken");
var Faucet = global.artifacts.require("Faucet");

module.exports = async function(deployer, network, accounts) {
	//deploy the faucet
	return deployer.deploy(Faucet, {from: GOATConfig.accounts.casinoOwner}).then(function(){
		Promise.all([
			//wait for faucet to be deployed
			Faucet.deployed(),
			//get deployed instance of the token the exchange points to
			CasinoExchange.deployed().then(function(CasinoExchangeInstance){
				return CasinoExchangeInstance.casinoToken.call()
			}).then(function(CasinoTokenAddress){
				return CasinoToken.at(CasinoTokenAddress)
			})
		]).then(function(promises){
			return (function(FaucetInstance, CasinoTokenInstance){
				//initialize faucet with token contract address
				return FaucetInstance.initFaucet.sendTransaction(CasinoTokenInstance.address, {from: GOATConfig.accounts.casinoOwner}).then(function(){
					//send tokens to the faucet
					console.log("transferring tokens to ", FaucetInstance.address, " using ", CasinoTokenInstance.address)
					return CasinoTokenInstance.transfer.sendTransaction(FaucetInstance.address, 10**19, {from: GOATConfig.accounts.casinoOwner})
				})

			}).apply(null, promises)
		})
	})

};
