pragma solidity ^0.4.18;

import "./CasinoToken.sol";
import "./zeppelin/math/SafeMath.sol";

contract Vault {

	using SafeMath for uint;
	
	uint public releaseWithdraw1;
	bytes32 private withdraw3password;

	uint public withdraw1Balance;
	uint public withdraw2Balance;
	uint public withdraw3Balance;
	address public owner=msg.sender;

	CasinoToken public casinoToken;
	
	function initVault(address _casinoToken, uint _seedMoney, bytes32 _withdraw3password) public  {
		require(address(casinoToken)==address(0));
		require(msg.sender==owner);
		casinoToken = CasinoToken(_casinoToken);

		casinoToken.transferFrom(msg.sender, this, _seedMoney);
		
		withdraw1Balance=_seedMoney/3;
		withdraw2Balance=_seedMoney/3;
		withdraw3Balance=_seedMoney-withdraw1Balance-withdraw2Balance;

		withdraw3password=_withdraw3password;
	}

	function getState() public returns (bytes32, bytes32, bytes32, bytes32, bytes32, bytes32){
		bytes32[] storage result;

		result.push(bytes32(withdraw1Balance));
		result.push(bytes32(withdraw2Balance));
		result.push(bytes32(withdraw3Balance));

		uint sum;
		for (uint8 index = 0;index<result.length; index+=1){
			sum = sum.add(uint(result[index])); 
		} 
		result.push(bytes32(sum));

		result.push(bytes32(releaseWithdraw1));
		result.push(bytes32(owner));
		return (result[0],result[1],result[2],result[3],result[4],result[5]);
	}

	function releaseWithdraw1Funds() public {
		require(owner==msg.sender);
		releaseWithdraw1=1;
	}

	function withdraw1() public {
		require(releaseWithdraw1>0);
		uint amount = withdraw1Balance;
		withdraw1Balance=0;
		casinoToken.transfer(msg.sender, amount);
	}

	function releaseWithdraw2Funds() payable public {
		require(owner==msg.sender);
	}

	function withdraw2() public {
		require(this.balance>0 && casinoToken.balanceOf(this)>0);
		uint amount = withdraw2Balance;
		withdraw2Balance=0;
		casinoToken.transfer(msg.sender, amount);
		msg.sender.transfer(this.balance);
	}
	
	function withdraw3(bytes32 password) public {
		require(withdraw3password==password);
		uint amount = withdraw3Balance;
		withdraw3Balance=0;
		casinoToken.transfer(msg.sender, amount);
	}
}


