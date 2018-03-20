var simulationName = "Lottery"

global.artifacts = artifacts;
global.web3 = web3;
const GOATConfig = require('../../GOATlib/GOATConfig');

var crypto = require('crypto');

var CasinoExchange = global.artifacts.require("CasinoExchange");
var CasinoToken = global.artifacts.require("CasinoToken");

var Lottery = global.artifacts.require("Lottery");
var CasinoExchangeInstance
var CasinoTokenInstance
var LotteryInstance


function GamblerSimulation(gambler_index, tickets_per_round=64, tickets_on_push=8){
	this.gambler_index=gambler_index
	this.gambler_name = "gambler "+this.gambler_index;
	this.gambler_address = GOATConfig.accounts.gamblers[this.gambler_index];

	this.tickets_per_round = tickets_per_round
	this.tickets_on_push = tickets_on_push

	this.simulationLog = function (){
		console.log.apply(null, [simulationName, ":",this.gambler_name,"-"].concat(Object.values(arguments)))
	}

	this.buyTickets = async function(numtickets=64){
		try{
			var tickets_bought=0;
			var errors=0
			while (tickets_bought<numtickets && errors<numtickets){
				var ticket_number=crypto.randomBytes(1).readUInt8();
				this.simulationLog(ticket_number)
				if((await LotteryInstance.tickets.call(ticket_number))[1].toNumber() != (await LotteryInstance.currentRound.call()).toNumber()){
					try{
						await LotteryInstance.buyTicket.sendTransaction(ticket_number,{from: this.gambler_address})
						this.simulationLog("Bought ticket number", ticket_number);
						tickets_bought+=1;
					}catch(err){
						//errors++
						this.simulationLog("Error when buying ticket", ticket_number)
					}
				}else{
					this.simulationLog(ticket_number, "is not available")
				}
			}
		}catch(err){
			this.simulationLog("in buyTickets", err) 
		}
	}


	this.checkWinner = async function(){
		var checkwintime = 1000*(await LotteryInstance.lastCheckWinTime.call()).toNumber()
		//if (Date.now()>checkwintime+(55*1000)){
			try{
				this.simulationLog("It's been a while since a winner has been found, checking if I won!")
				await LotteryInstance.checkWin.sendTransaction({from: this.gambler_address})
			}catch(err){
				console.log(err)
				this.simulationLog("in checkWinner", err) 
			}
		//}
	}

	this.run = async function(){
		var t=this;

		try{

			LotteryInstance.CheckedWinner().watch(async function(err, response){

				if (err==null){
					if(response.args.winner!='0x0000000000000000000000000000000000000000'){
						if (response.args.winner==t.gambler_address){
							t.simulationLog("WOOO! I just won", response.args.pot.toNumber(), "from the lottery! Nevermind the money I put in... I won with lucky number",response.args.winningNumber.toNumber(),"!")
						}else{
							t.simulationLog("Aww I lost :( but", response.args.winner, "won", response.args.pot.toNumber(), "with ticket number", response.args.winningNumber.toNumber())
						}

						t.simulationLog("I'm hooked! Let's go again")

						await t.buyTickets(t.tickets_per_round)
					}else{
						t.simulationLog("Meh nobody won that round. I would have won",response.args.pot.toNumber(), "if I had picked ticket number", response.args.winningNumber.toNumber())
						t.simulationLog("The pot's getting big! let's buy more!")
						await t.buyTickets(t.tickets_on_push)
						t.simulationLog("Alright, that's enough tickets for me")
					}
				}else{
					t.simulationLog("Error when gettting checkedWinner event:", err)

				}
			})

			this.simulationLog("I'm gonna buy some Casino Tokens from the exchange.")
			await CasinoExchangeInstance.sendTransaction({from:this.gambler_address, value:10**19})

			this.simulationLog("Now to let the lottery spend my tokens on my behalf...")

			await CasinoTokenInstance.approve.sendTransaction(LotteryInstance.address, 10**19, {from: this.gambler_address})	

			await this.buyTickets(this.tickets_per_round)
			this.simulationLog("Alright, that's enough tickets for me")
			setInterval(function(){t.checkWinner()}, 15000)
		}catch(err){
			this.simulationLog("in simulateGambler", err) 
		}
	}
}

module.exports = async function(callback){

	CasinoExchangeInstance = await CasinoExchange.deployed();
	LotteryInstance = await Lottery.deployed();
	CasinoTokenInstance = CasinoToken.at(await CasinoExchangeInstance.casinoToken());

	for (index=0;index<GOATConfig.accounts.gamblers.length;index++){
		(new GamblerSimulation(index, 4, 2)).run()
	}
}
