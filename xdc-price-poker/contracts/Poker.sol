// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

interface PokeLike {
  function poke(bytes32 ilk) external;
}

interface DripLike {
  function drip(bytes32 ilk) external;
}

contract Poker {
  PokeLike constant Spot = PokeLike(0xa012d57f451f2EE615BE5369b35d8327EF954c22);
  DripLike constant Jug = DripLike(0x580EBcc11C32566Aa739A298556C8D8CFf81E22F);

  function poke() external {
    Spot.poke('XDC-A');
    Spot.poke('XDC-B');
    Spot.poke('XDC-C');

    Jug.drip('XDC-A');
    Jug.drip('XDC-B');
    Jug.drip('XDC-C');
  }
}
