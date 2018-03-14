//imports library used to tell which accounts are which
global.web3 = web3;
const GOATConfig = require('../../GOATlib/GOATConfig');

//imports libraries to compile solidity
var fs = require('fs')
var solc = require('solc')


//Import truffle's definitions of contracts 
var CasinoExchange = artifacts.require("CasinoExchange");
var CasinoExchangeInstance

var CasinoToken = artifacts.require("CasinoToken");
var CasinoTokenInstance

var Faucet = artifacts.require("Faucet");
var FaucetInstance

var Vault = artifacts.require("Vault");
var VaultInstance

var Lottery = artifacts.require("Lottery");
var LotteryInstance

async function printbalances(){
	console.log("Now I have", (await web3.eth.getBalance(GOATConfig.accounts.attacker)).toNumber(), "ether")
	console.log("Now I have", (await CasinoTokenInstance.balanceOf.call(GOATConfig.accounts.attacker)).toNumber(), "CasinoTokens")
}

//This gets executed when you run `truffle exec exec/examples/example_interactions.js`
module.exports = async function(callback){
	//<contract>.deployed() will return an instance of a contract deployed at the address that Truffle remembers deploying to.
    CasinoExchangeInstance = await CasinoExchange.deployed();
    FaucetInstance = await Faucet.deployed();
    VaultInstance = await Vault.deployed();
    LotteryInstance = await Lottery.deployed();

    //Since CasinoToken gets created by CasinoExchange's constructor and not Truffle itself, Truffle doesn't know where it is. Therefore, we have to ask the CasinoExchange where the contract resides and tell Truffle.
	CasinoTokenInstance = CasinoToken.at(await CasinoExchangeInstance.casinoToken());

	//I can check my current balance of ether
	console.log("I have", (await web3.eth.getBalance(GOATConfig.accounts.attacker)).toNumber(), "ether")

	//I can also check my current balance of CasinoTokens
	console.log("I have", (await CasinoTokenInstance.balanceOf.call(GOATConfig.accounts.attacker)).toNumber(), "CasinoTokens")

	//I can buy ether from the exchange using the fallback function
	console.log("buying 10**16 tokens from the exchange")
	await CasinoExchangeInstance.sendTransaction({value:10**16})
	await printbalances();

	//I can ask the faucet for some free tokens
	console.log("Getting free tokens from the faucet")
	await FaucetInstance.getFreeTokens.sendTransaction()
	await printbalances();

	//I can watch the lottery logs to see who wins
	LotteryInstance.CheckedWinner().watch(async function(err, response){
		//(triggered whenever the CheckedWinner event happens)
		if (err==null){
			if(response.args.winner!='0x0000000000000000000000000000000000000000'){
				console.log(response.args.winner, "won", response.args.pot.toNumber(), "with ticket number", response.args.winningNumber.toNumber())

			}else{
				console.log("Nobody won that round. Someone would have won",response.args.pot.toNumber(), "if they had picked ticket number", response.args.winningNumber.toNumber())
			}
		}else{
			console.log("Error when gettting checkedWinner event:", err)

		}
	})

	//To buy tickets from the lottery, we approve the lottery contract to spend a number of tokens on our behalf. When we actually buy a ticket, the lottery contract will transfer the appropriate amount of tokens to themselves.
	console.log("Approving the lottery to spend tokens on my behalf")
	await CasinoTokenInstance.approve.sendTransaction(LotteryInstance.address, 10**16)
	console.log("buying lottery ticket with lucky number 13")
	try{
		await LotteryInstance.buyTicket.sendTransaction(13)
	}catch(err){
		console.log("looks like someone has already bought the ticket or I didn't approve enough tokens")
	}
	await printbalances()

	//I can also deploy my own contracts
	console.log("compiling contract...")
	var ExampleCode = fs.readFileSync('./exec/examples/Example.sol').toString()
	var compiledExampleCode = solc.compile(ExampleCode)

	var ExampleAbi = JSON.parse(compiledExampleCode.contracts[':Example'].interface)
	var Example = web3.eth.contract(ExampleAbi)

	var ExampleByteCode = compiledExampleCode.contracts[':Example'].bytecode

	console.log("deploying contract...")
	var ExampleInstance

	try{
		ExampleInstance = await (new Promise(function(resolve, reject){

			Example.new({data: ExampleByteCode, gas: 4700000, from:GOATConfig.accounts.attacker}, function(err, deployed){
				if(err){
					reject(err)
				}else if(deployed!=undefined && deployed.address!=undefined){
					resolve(deployed)
				}
					
			})
		}));	
	}catch(err){
		console.log("Error when deploying contract:", err)
	}

	//I can now interact with the contract I deployed 
	console.log("Example contract's count value:", (await ExampleInstance.count.call({from:GOATConfig.accounts.attacker})).toNumber())
	console.log("calling `add`")
	await ExampleInstance.add.sendTransaction({from:GOATConfig.accounts.attacker})
	console.log("Example contract's new count value:", (await ExampleInstance.count.call({from:GOATConfig.accounts.attacker})).toNumber())

	//I can even get my contract to interact with the GOATCasino's contracts
	console.log("Example contract's balance in tokens:", (await ExampleInstance.getMyBalance.call(CasinoTokenInstance.address,{from:GOATConfig.accounts.attacker})).toNumber())
}
