pragma solidity ^0.4.18;

import "./zeppelin/ownership/Ownable.sol";
import "./CasinoToken.sol";


contract CasinoExchange is Ownable{
	CasinoToken public casinoToken = new CasinoToken();

	function CasinoExchange() public {
		casinoToken.mint(this, 10**22);
		casinoToken.mint(owner, 10**20);
	}

	function buy(address _purchaser, uint _amount) internal {
		casinoToken.transfer(_purchaser, _amount);
	}

	function () payable public {
		buy(msg.sender, msg.value);
	}

	function redeem(uint _amount) public {
		require(casinoToken.transferFrom(msg.sender, this, _amount));
		msg.sender.transfer(_amount);
	}

	function getEmergencyFunds() public {//Give the exchange extra funds if we run out.
		casinoToken.getEmergencyFunds();
	}

}

