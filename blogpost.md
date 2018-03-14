# Intro

The rise of blockchain technology has brought about the invention of Ethereum.
The Ethereum Virtual Machine (EVM) is a trustless, distributed computer that stores its state on a blockchain.
Developers can define logic in the form of smart contracts, which are pieces of code that can be executed by the EVM.
Executing and verifying code on a blockchain creates a neutral third party that can be trusted to execute code exactly as written without bias and change the state accordingly.
Smart contracts present a new target to attackers beyond the sophisticated attacks required to attack a widely used blockchain such as Ethereum.
In fact, there are many examples of attackers exploiting the logic of smart contracts to perform attacks with effects such as draining of funds, gaining an advantage over other users of the smart contract, and rendering the smart contract unusable.
These attacks are often devastating due to the huge amounts of value placed in these smart contracts by their users.
Due to the novelty and popularity of smart contracts, many of the worst smart contract vulnerabilities may not yet be discovered.
In the meantime, the classes of vulnerabilities that have been discovered should be studied by smart contract developers and auditors to better secure their smart contracts against them.

GOATCasino is a Truffle project which deploys a set of intentionally vulnerable smart contracts to a local test network.
The contracts implement a wide variety of common mistakes that smart contract developers can make from re-entrance to logic flaws.
The purpose of the GOATCasino is to provide smart contract developers and auditors with a sampling of a wide variety of common vulnerabilities found in smart contracts so that they can identify them and avoid making the same mistakes.
Furthermore, the GOATCasino allows auditors to exploit these different classes of vulnerabilities in a safe setting where they can assess the exploitability of an attack without worrying about affecting actual smart contract users or needing to find or implement a realistic scenario.
Fully exploiting a vulnerability with a proof of concept is likely to yield a better understanding of how the EVM works and why the vulnerability exists in the first place so that you can better determine what an appropriate mitigation would be.
If you exploit every flaw in the GOATCasino, then you will have built up a nice tool box of proof-of-concept scripts that can be slightly modified to apply to most real-world smart contract vulnerabilities.

# Helpful Things to Know When Hacking the GOATCasino:

If you are diving into this without any foundational knowledge of Solidity or Ethereum, that's alright!
Below are some important points to learn and some resources that may help you get started:

## Javascript
Being familiar with reading JavaScript syntax is essential. Solidity is very syntactically similar to JavaScript (with some other languages as influences as well) and a vast majority of the existing tools for working with Solidity are implemented in JavaScript. For example, this project utilizes the Truffle framework, which is written in JavaScript for deployment and so the deployment scripts are also written in JavaScript.

## Web3
Web3 is a popular JavaScript library used for interacting with Ethereum networks and the contracts deployed to them. The documentation for Web3 can be found [here](https://web3js.readthedocs.io/en/1.0/). Additionally, the [ethernaut](https://ethernaut.zeppelin.solutions/) challenges provide a very useful crash course on interacting with contracts using Web3. Ethernaut also implements examples of several of the same classes of vulnerabilities that you will encounter in the GOATCasino and is a great learning tool for smart contract security.

## Solidity
All of the smart contracts in the GOATCasino (and most of the smart contracts on Ethereum) are implemented in Solidity, which compiles to EVM bytecode. I've found that [Solidity's official documentation](http://solidity.readthedocs.io/en/develop/) has been the best resource for all things relating to Solidity from gaining foundational knowledge to answering low level questions about how the language works.

## Truffle
Since the project is deployed using Truffle, you may want to look into the [Truffle documentation](http://truffleframework.com/) to better understand the deployment code and to take advantage of the framework to interact with the contracts.

## Smart Contract Security
Once you have a good understanding of how Solidity and the EVM works and how to create and interact with contracts on Ethereum, you should start learning about the security pitfalls involved with writing smart contracts. The official Solidity documentation has a section on [security considerations](http://solidity.readthedocs.io/en/develop/security-considerations.html).
Additionally, the following links may be helpful towards this:
 1. https://eprint.iacr.org/2016/1007.pdf
 1. https://github.com/ConsenSys/smart-contract-best-practices
 1. http://www.blunderingcode.com/writing-secure-solidity/
 1. http://www.blunderingcode.com/security-beyond-solidity/
 1. https://blog.ethereum.org/2016/06/19/thinking-smart-contract-security/

## Ethereum Yellow Paper
If you searched through these links, Google, and Stack Overflow and you still can't find the answer to your Ethereum-related problem then it's time to dig into the [yellow paper for Ethereum itself](https://ethereum.github.io/yellowpaper/paper.pdf). (This shouldn't be necessary for any of the challenges in the GOATCasino)


# Instructions
Instructions for starting the GOATCasino can be found in the repository's README file.
The repository also provides examples of interacting with the contracts and an explanation of the architecture and purpose of each contract.
<!-- TKTK link to the repo here -->