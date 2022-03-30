import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [greeting, setGreetingValue] = useState<string>('');
  const [greetingVal, setGreetingVal] = useState<string>('');

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log('data: ', data);
        setGreetingVal(data);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  // async function getBalance() {
  //   if (typeof window.ethereum !== 'undefined') {
  //     const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
  //     const balance = await contract.balanceOf(account);
  //     console.log("Balance: ", balance.toString());
  //   }
  // }

  async function setGreeting(e: any) {
    e.preventDefault();
    if (!greeting) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue('');
      await transaction.wait();
      fetchGreeting();
    }
  }

  const inputStyle = {
    padding: '0.75em 0.5em',
    borderRadius: '0.5em',
    border: 'transparent',
    backgroundColor: '#e0e0e0',
    '&:focus': {
      outline: '1px solid #9c9c9c',
      border: 'none',
    },
  };

  return (
    <section
      style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}
    >
      <div style={{ width: '45%', textAlign: 'center' }}>
        <span
          style={{ textTransform: 'uppercase', opacity: '0.5', lineHeight: 1 }}
        >
          Greeting
        </span>
        <h1 style={{ lineHeight: 1, paddingBottom: '2em', fontSize: '2em' }}>
          {greetingVal}
        </h1>
        <form
          onSubmit={setGreeting}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <input
            type='text'
            value={greeting}
            onChange={(e) => setGreetingValue(e.target.value)}
            style={inputStyle}
          />
          <button
            type='submit'
            // onClick={() => setGreeting}
            style={{
              backgroundColor: 'black',
              padding: '1em',
              color: 'white',
              border: 'transparent',
              fontWeight: 'bold',
              borderRadius: '0.25em',
              cursor: 'pointer',
            }}
          >
            Set Greeting
          </button>
        </form>
      </div>
    </section>
  );
}

export default App;
