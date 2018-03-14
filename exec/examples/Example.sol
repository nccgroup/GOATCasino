pragma solidity ^0.4.18;

contract Token {
	function balanceOf(address who) public constant returns (uint256);
}

contract Example{
	uint public count = 0;

	function Example () public{
		count = 1;
	}

	function add() public{
		count+=1;
	}

	function getMyBalance(address token) returns (uint256){
		return Token(token).balanceOf(this);
	}
	
}