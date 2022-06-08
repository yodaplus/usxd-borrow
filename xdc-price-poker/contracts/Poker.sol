// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

interface PokeLike {
  function poke(bytes32 ilk) external;
}

interface DripLike {
  function drip(bytes32 ilk) external;
}

contract Poker {
  PokeLike public Spot;
  DripLike public Jug;

  constructor(address spot, address jug) {
    Spot = PokeLike(spot);
    Jug = DripLike(jug);
  }

  function poke() external {
    Spot.poke('XDC-A');
    Spot.poke('XDC-B');
    Spot.poke('XDC-C');

    Jug.drip('XDC-A');
    Jug.drip('XDC-B');
    Jug.drip('XDC-C');
  }
}
