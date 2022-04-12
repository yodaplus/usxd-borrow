// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

interface PokeLike {
  function poke(bytes32 ilk) external;
}

interface DripLike {
  function drip(bytes32 ilk) external;
}

contract Poker {
  PokeLike constant Spot = PokeLike(0x56848a428B5CeD7AdC021C75802ab8390092Ab9E);
  DripLike constant Jug = DripLike(0x6cbe426382cDFf2B2C0E00B865E5358fd59829Ff);

  function poke() external {
    Spot.poke('XDC-A');
    Spot.poke('XDC-B');
    Spot.poke('XDC-C');

    Jug.drip('XDC-A');
    Jug.drip('XDC-B');
    Jug.drip('XDC-C');
  }
}
