# Welcome to the GOAT Casino!

Try your luck(or skills) at the various games in the casino to win fabulous tokens and prizes!

This is under development so there may be a disappointing amount of games at the moment but there are more to come and plenty of things to exploit in the meantime.

## To Begin:
1. Install dependencies
	1. The latest version of [node](https://nodejs.org/en/download/package-manager/)
	1. `sudo apt install npm`
	2. `sudo npm install -g truffle truffle-testrpc`

2. Run `./start_challenge.sh` to start testrpc, deploy the casino to your local testnet, and begin simulating the other players
3. Review the code in the `contracts/` directory to find vulnerabilities
4. Make proof of concept scripts to obtain as many CasinoTokens as you can! (look at the simulated user scripts in `exec/simuilated-users/` directory to get an idea of how to interact with the contracts if you are stuck)

## Rules:
1. Only perform actions as the "attacker", which is the first account in the testrpc. I made it easy because that's the account truffle will use by default but if you want to be sure you are right, you can use the library at `GOATlib/GOATConfig.js` and use `GOATConfig.accounts.attacker` for all your calls. I know you have access to the actual owner accounts and the other players since it's on testrpc and I'm not impressed with your script to cycle through the accounts and call `transfer`.
2. You can change the contracts/deployment code/simulated users as much as you like for debugging purposes, but keep in mind that your solutions should work on the unmodified code by the end.

## Directory structure:
* `GOATlib/`: Library with code used by the various JavaScript files.
* `build/`: The directory Truffle creates when it compiles the project. It contains information on all of the contracts in the project including the compiled bytecode and the addresses of the deployed contracts.
* `contracts/`: The smart contract code.
* `exec/simulated-users/`: Scripts controlling the simulated gamblers playing the various games.
* `exec/examples`: Example scripts that you can refer to when building your exploits
* `migrations/`: scripts executed by truffle for deployment. They are executed in alphabetical order and can offer insights into how the contracts are initialized and how they fit together.

## Contract Descriptions

All of the games in the GOATCasino use an ERC20-compliant token, which is defined in the `CasinoToken.sol` file.
The CasinoToken makes use of some widely-used zeppelin contracts to implement much of the standard functionalities of a token.
You can use the contract defined in `CasinoExchange.sol` to buy and sell CasinoTokens in exchange for ether.

The `Faucet.sol` file defines a contract which can be used once per user to get a free supply of CasinoTokens to try out the games.

The `Vault.sol` contract holds a reserve of funds for the owner to access. Equal portions of the vault's funds are protected by separate methods of access controls in order to better protect the funds if one method is found to be insufficient.

Finally, the only game in the casino at the moment is the lottery.
Users can purchase tickets by number from 0 to 255.
Each minute, a user can trigger the `checkWin` function to generate the winning ticket number, reward the winner with the prize money (mius the house's cut) and starts a new round by clearing the purchased tickets.
If nobody purchased the winning ticket, then the round continues for another minute of purchasing before a new winning ticket can be chosen.
