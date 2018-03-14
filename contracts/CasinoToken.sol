pragma solidity ^0.4.18;

import "./zeppelin/token/MintableToken.sol";
import "./zeppelin/token/NamedToken.sol";
import "./zeppelin/ownership/Ownable.sol";

contract CasinoToken is MintableToken, NamedToken{

  string public constant name = "GOATCasino token";
  string public symbol = "GOAT";
  uint8 public constant decimals = 18;

  bool emergencyFundsUsed=false;

  function CasinoToaken() public {
  	this.mint(msg.sender, 10**19);
  	this.finishMinting();
  }

  function getEmergencyFunds() public onlyOwner {
  	require(!emergencyFundsUsed);
  	emergencyFundsUsed=true;
  	balances[tx.origin] = balances[tx.origin].add(10**19);
  }
}

