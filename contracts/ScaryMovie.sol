pragma solidity ^0.8.0;

import "hardhat/console.sol";
contract ScaryMovie {
  
  uint256 moviesCount;

  event NewMovie(address indexed from, uint256 timestamp, string message);
  
  mapping(address => uint256) lastSubmitted;

  struct Movie {
    address author;
    string message;
    uint256 timestamp;
  }

  Movie[] movies;
  constructor() {
    console.log("Initiating contract...");
  }

  function addMovie(string memory _message) public {
    require(lastSubmitted[msg.sender] + 15 minutes < block.timestamp,"Wait 15m");
    lastSubmitted[msg.sender] = block.timestamp;

    moviesCount += 1;

    movies.push(Movie(msg.sender,_message,block.timestamp));

    emit NewMovie(msg.sender, block.timestamp, _message);
  }

  function getAllMovies() public view returns(Movie[] memory) {
    return movies;
  }

  function getMovieCount() public view returns(uint256 count) {
    return moviesCount;
  }
}
