global.artifacts = artifacts;
global.web3 = web3;
const GOATConfig = require('../../GOATlib/GOATConfig');


var CasinoExchange = global.artifacts.require("./CasinoExchange.sol");
var CasinoToken = global.artifacts.require("./CasinoToken.sol");

module.exports = async function(callback){

    var CasinoExchangeInstance = await CasinoExchange.deployed();

	CasinoTokenInstance = CasinoToken.at(await CasinoExchangeInstance.casinoToken());
	console.log((await CasinoTokenInstance.balanceOf.call(CasinoExchangeInstance.address)).toNumber())
	console.log((await CasinoTokenInstance.balanceOf.call(GOATConfig.accounts.casinoOwner)).toNumber())
	console.log((await CasinoTokenInstance.balanceOf.call(GOATConfig.accounts.attacker)).toNumber())

	await CasinoExchangeInstance.sendTransaction({from:GOATConfig.accounts.attacker, value:1000})

	console.log((await CasinoTokenInstance.balanceOf.call(CasinoExchangeInstance.address)).toNumber())
	console.log((await CasinoTokenInstance.balanceOf.call(GOATConfig.accounts.casinoOwner)).toNumber())
	console.log((await CasinoTokenInstance.balanceOf.call(GOATConfig.accounts.attacker)).toNumber())

	await CasinoTokenInstance.approve.sendTransaction(CasinoExchangeInstance.address, 100, {from: GOATConfig.accounts.attacker})
	console.log((await CasinoTokenInstance.allowance.call(GOATConfig.accounts.attacker, CasinoExchangeInstance.address)).toNumber())

	await CasinoExchangeInstance.redeem(100, {from: GOATConfig.accounts.attacker})

	console.log((await CasinoTokenInstance.balanceOf.call(CasinoExchangeInstance.address)).toNumber())
	console.log((await CasinoTokenInstance.balanceOf.call(GOATConfig.accounts.casinoOwner)).toNumber())
	console.log((await CasinoTokenInstance.balanceOf.call(GOATConfig.accounts.attacker)).toNumber())
	
    callback();
}