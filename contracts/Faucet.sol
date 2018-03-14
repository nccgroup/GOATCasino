pragma solidity ^0.4.18;

import "./CasinoToken.sol";

contract Faucet {

	CasinoToken public casinoToken;

	mapping (address => bool) public redeemed;

	uint public maxRedemptions = 1000;

	uint public timesRedeemed = 1;//so that the first payout isn't zero

	function initFaucet(address _casinoToken) public  {
		require(address(casinoToken)==address(0));
		casinoToken = CasinoToken(_casinoToken);
	}

	function getCurrentPayout() public view returns (uint _currentPayout){
		uint tokenBalance = casinoToken.balanceOf(this);
		_currentPayout = tokenBalance*timesRedeemed/2000;
		if(_currentPayout>tokenBalance){
			_currentPayout=tokenBalance;
		}
	}

	function getFreeTokens() public {
		require(address(casinoToken) != address(0));
		require(timesRedeemed!=maxRedemptions);
		require(redeemed[msg.sender]==false);

		uint payout = getCurrentPayout();

		redeemed[msg.sender]=true;
		timesRedeemed+=1;

		require(casinoToken.transfer(msg.sender, payout));
	}

	function refundFaucet() public {
		require(address(casinoToken) != address(0));
		require(timesRedeemed-1>=0);
		uint payout = getCurrentPayout();

		redeemed[msg.sender]=false;

		timesRedeemed-=1;

		require(casinoToken.transferFrom(msg.sender, this, payout));
	}
}