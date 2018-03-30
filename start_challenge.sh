#!/bin/sh
trap "exit" INT TERM
trap "kill 0" EXIT

ganache-cli  -l 4500000000000 \
--account="0xe7cb95c2e64f33a789563d76465840df88b95f8d9ea6497e50a43309cc53ed2b,0xde0b6b3a7640000" \
--account="0xfb16703fb972d95d113b55010cf4d8dc62e05e75a06b1ab56cf916943838efd1,0x3635c9adc5dea00000" \
--account="0x280b69e2e1ff39e19882183155cf65fda82fe8e2139f0689cf07ea6bae656d4f,0x3635c9adc5dea00000" \
--account="0x95b5ad45370b252f8ff1b12de4a24921ecee6b2fdb8c63a63ca69fdd5463f241,0x3635c9adc5dea00000" \
--account="0xd612573468c4349d305cfcfe8e9fdaf55ee6d57184223a5846eb00c05e302118,0x3635c9adc5dea00000" \
--account="0x9f9262504406d898870bc984d0e577e80af0b8627847d0f2ecbcb02ee131fc4a,0x3635c9adc5dea00000" \
--account="0xbf558b6dad1d6cc578fb8b4ccbf6a6773ea604b8688c6e79f627a55887625045,0x3635c9adc5dea00000" \
--account="0xd9eeeb867638c177737b699e8a2842be953d542fd7ed6e40499655cdd271710f,0x3635c9adc5dea00000" \
--account="0xdac3e49dedc8858e67c85c88636a46109aba2db1a3cb8e4e556787974ef303f9,0x3635c9adc5dea00000" \
--account="0x85e6ff259637e1aceb4477e339144830cad494d72708898fe1679bf72f3674b0,0x21e19e0c9bab2400000"\
> ganache_output.txt 2>&1 &

truffle migrate --reset

truffle exec exec/simulated-users/lottery.js &
truffle exec exec/simulated-users/faucet.js &

truffle console

