pragma solidity ^0.4.18;

import "./zeppelin/ownership/Ownable.sol";
import "./CasinoToken.sol";
import "./CasinoExchange.sol";

contract StrawDraw is Ownable{
	/*
	CasinoExchange public exchange;
	CasinoToken public token;

	struct Participant {
		address contributor;
		bool withdrawn;
		uint ranking;
	}

	Participant[] public participants;

	uint[] public standings;

	uint public winnerIndex;

	uint8 public state;

	uint public price = 10**16;

	uint public startTime;

	uint public roundDuration=1 minutes;

	modifier isState(uint _state){
		require(state==_state);
	}

	event JoiningStarted();
	event JoiningEnded();

	function initStrawDraw(address _casinoExchange) isOwner isState(0) public  {
		require(address(_casinoExchange)!=address(0));
		exchange = CasinoExchange(_casinoToken);
		token = CasinoToken(exchange.casinoToken());
		internalResetStrawDraw();
	}

	function internalResetStrawDraw() internal {
		state=1;
		startTime=now;
		participants.length=0;
		JoiningStarted();
	}

	function internalEndJoining() internal returns (bool) {
		if(now>startTime+roundDuration){
			state=2;
			JoiningEnded();
			return true;
		}
		return false;
	}

	function endJoining() isState(1) public {
		require(internalEndJoining());
	}

	function join() public {
		require(token.transferFrom(msg.sender, address(this), price));
		participants.push(Participant(msg.sender));
		internalEndJoining();
	}

	function postResults(uint[] _standings) isState(2) onlyOwner public{
		require(_standings.length==participants.length);
		standings = _standings;

		for (uint i=0; i<standings.length; i+=1){
			participants[standings[i]]=i;
		}

		for (uint i=0; i<participants.length; i+=1){
			participants[standings[i]]=i;
		}
	}
	*/
}