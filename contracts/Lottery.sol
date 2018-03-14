pragma solidity ^0.4.18;

import "./zeppelin/ownership/Ownable.sol";
import "./CasinoToken.sol";

contract Contributor{
	function wonLottery(uint amount) public;
}

contract Lottery is Ownable {
	struct Ticket {
		address contributor;
		uint roundNumber;
	}

	CasinoToken public casinoToken;

	mapping (uint8 => Ticket) public tickets;

	uint public lastCheckWinTime=now;
	uint public currentRound;
	uint public pot;
	uint public profits;
	uint public price=10**16; 

	event CheckedWinner(uint8 winningNumber, address indexed winner, uint pot);

	function Lottery() public {
		startRound();
	}

	modifier initialized() {
		require(address(casinoToken) != address(0));
		_;
	}
	function initLottery(address _casinoToken) public onlyOwner {
		casinoToken = CasinoToken(_casinoToken);
	}

	function startRound() internal {
		currentRound+=1;
		lastCheckWinTime=now;
		pot=0;
	}

	function checkWin() initialized public {
		if(now>(lastCheckWinTime+1 minutes)){
			uint8 winningNumber = uint8(keccak256(block.coinbase, now, msg.sender, tx.origin));
			Ticket storage winningTicket = tickets[winningNumber];
			uint winnerCodeLength;
			address winner = winningTicket.contributor;

			if(winningTicket.roundNumber==currentRound){
				require(casinoToken.transfer(winner, pot));
				assembly {
					winnerCodeLength:= extcodesize(winner)
				}
				if(winnerCodeLength>0){
					Contributor(winner).wonLottery(pot);
				}
				CheckedWinner(winningNumber, winner, pot);
				startRound();
			}else{
				lastCheckWinTime=now;
				CheckedWinner(winningNumber, address(0), pot);
			}
		}
	}

	function buyTicket(uint8 ticketNumber) initialized public{
		Ticket storage existingTicket = tickets[ticketNumber];
		require(existingTicket.contributor==address(0) || existingTicket.roundNumber!=currentRound);
		require(casinoToken.transferFrom(msg.sender, address(this), price));
		profits+=(price*25000/100000);
		pot+=price-(price*25000/100000);
		tickets[ticketNumber]=Ticket(msg.sender, currentRound);
		checkWin();
	}

	function getProfits() initialized onlyOwner public {
		uint profitsToPay = profits;
		profits=0;
		casinoToken.transfer(owner, profitsToPay);
	}
}