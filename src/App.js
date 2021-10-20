import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import scaryMovie from './utils/ScaryMovie.json';
import ghostface from './images/ghostface.png';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allMovies, setAllMovies] = useState([]);
  const [message, setMessage] = useState("");
  const [button, setButton] = useState("Submit Answer");
  const [color, setColor] = useState();

  const contractAddress = "0xc82B7fD4eEd3Ebc62534E51429d1251c28d5678D";
  
  const getAllMovies = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const scaryMovieContract = new ethers.Contract(contractAddress, scaryMovie.abi, signer);

  
        const movies = await scaryMovieContract.getAllMovies();
        

        let moviesCleaned = [];
        movies.forEach(movie => {
          moviesCleaned.unshift({
            address: movie.author,
            timestamp: new Date(movie.timestamp * 1000),
            message: movie.message
          });
        });

        setAllMovies(moviesCleaned);

        scaryMovieContract.on("NewMovie", (from, timestamp, message) => {
          setAllMovies(prevState => [{
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
          },...prevState ]);
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        return;
      } 

      getAllMovies();
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
        
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("You need a MetaMask wallet to connect.");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 

    } catch (error) {
      console.log(error)
    }
  }

  const submitMovie = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const scaryMovieContract = new ethers.Contract(contractAddress, scaryMovie.abi, signer);


        const submitTxn = await scaryMovieContract.addMovie(message, { gasLimit: 300000 });
        console.log("Mining...", submitTxn.hash);

        setMessage("");
        setButton("Mining...");
        setColor("grey");

        await submitTxn.wait();
        console.log("Mined -- ", submitTxn.hash);

        setTimeout(setButton("Submit Answer"), 3000);
        setColor();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
 
  useEffect(() => {
    checkIfWalletIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <img src={ghostface} alt="Ghostface"/>
          <h1>What's Your Favorite Scary Movie?</h1>
        </div>
        <div className="center">
          <p id="bio">Connect your MetaMask wallet to Rinkeby and have a little test ETH to submit your answer. There's a 15 minute cooldown period before you can submit another movie.</p>
          <input 
            type="text" 
            id="input-text" 
            value={message}
            onChange={ e => 
            setMessage(e.target.value)
            }/>
          <button 
            className="square-btn" 
            onClick={submitMovie}
            style={{background:color}}>
            {button}
            </button>
        </div>
        
        {!currentAccount && (
          <button className="square-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        <div id="spacer"></div>
        {allMovies.map((movie, index) => {
          return (
            <div id="list" key={index}>
              <h2>{movie.message}</h2>
              <p id="addy">Submitted By: {movie.address}</p>
              <p id="time">{movie.timestamp.toString()}</p>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App