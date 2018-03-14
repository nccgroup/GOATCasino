global.artifacts = artifacts; 
global.web3 = web3;
const GOATConfig = require('../GOATlib/GOATConfig');

var CasinoExchange = global.artifacts.require("./CasinoExchange.sol");
var Lottery = global.artifacts.require("Lottery");

module.exports = async function(deployer, network, accounts) {
	await deployer.deploy(Lottery, {from: GOATConfig.accounts.casinoOwner});
	LotteryInstance = await Lottery.deployed()

    var CasinoExchangeInstance = await CasinoExchange.deployed();
	CasinoTokenAddress = await CasinoExchangeInstance.casinoToken.call();

	await LotteryInstance.initLottery.sendTransaction(CasinoTokenAddress, {from: GOATConfig.accounts.casinoOwner})
};
