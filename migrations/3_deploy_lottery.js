global.artifacts = artifacts; 
global.web3 = web3;
const GOATConfig = require('../GOATlib/GOATConfig');

var CasinoExchange = global.artifacts.require("./CasinoExchange.sol");
var Lottery = global.artifacts.require("Lottery");

module.exports = function(deployer, network, accounts) {
	//deploy the lottery contract
	return deployer.deploy(Lottery, {from: GOATConfig.accounts.casinoOwner}).then(function(){
		return Promise.all([
			//get deployed exchange and request casinoToken address from it
			CasinoExchange.deployed().then(function(CasinoExchangeInstance){
				return CasinoExchangeInstance.casinoToken.call()
			}),
			//wait for lottery to be deployed
			Lottery.deployed()
		]).then(function(promises){
			return ((function(CasinoTokenAddress, LotteryInstance){
				//initialize the lottery with the address of the token
				console.log("initializing lottery with token address: ", CasinoTokenAddress)
				return LotteryInstance.initLottery.sendTransaction(CasinoTokenAddress, {from: GOATConfig.accounts.casinoOwner})
			}).apply(null, promises))
		})
	})
};
