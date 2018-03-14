var simulationName = "Faucet"

global.artifacts = artifacts;
global.web3 = web3;
const GOATConfig = require('../../GOATlib/GOATConfig');

var Faucet = global.artifacts.require("Faucet");
var CasinoToken = global.artifacts.require("CasinoToken");
var FaucetInstance
var CasinoTokenInstance


function GamblerSimulation(gambler_index){
	this.gambler_index=gambler_index
	this.gambler_name = "gambler "+this.gambler_index;
	this.gambler_address = GOATConfig.accounts.gamblers[this.gambler_index];

	this.simulationLog = function (){
		console.log.apply(null, [simulationName, ":",this.gambler_name,"-"].concat(Object.values(arguments)))
	}

	this.run = async function(){

		try{
			this.simulationLog("I'm gonna get my free tokens!")
			await FaucetInstance.getFreeTokens.sendTransaction({from:this.gambler_address})

			this.simulationLog("Got my free tokens! Now I have", (await CasinoTokenInstance.balanceOf(this.gambler_address)).toNumber())
		}catch(err){
			this.simulationLog("Something went wrong with getting my free tokens :( I guess they were all taken", err) 
		}
	}
}

module.exports = async function(callback){

    FaucetInstance = await Faucet.deployed();
	CasinoTokenInstance = CasinoToken.at(await FaucetInstance.casinoToken());

	for (index=0;index<GOATConfig.accounts.gamblers.length;index++){
		(new GamblerSimulation(index)).run()
	}
}
