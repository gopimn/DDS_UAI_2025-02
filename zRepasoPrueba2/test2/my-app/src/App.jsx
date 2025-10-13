import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [count, setCount] = useState(0)
  // 1. State for storing the fetched data (list of strings)
  const [users, setUsers] = useState([]);
  // 2. State for managing loading status
  const [isLoading, setIsLoading] = useState(true);
  // 3. State for handling any potential errors
  const [error, setError] = useState(null);

  const API_URL = 'http://127.0.0.1:3000/usuarios';

  useEffect(() => { 
    /**
     * Async function to perform the data fetching.
     */
    const fetchUsers = async () => {
      try {
        // Reset error and set loading state
        setError(null);
        setIsLoading(true);

        const response = await fetch(API_URL);

        // Check if the response was successful (status 2xx)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response as JSON. We expect an array of strings.
        const data = await response.json();
        
        // Ensure the retrieved data is an array before setting state
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          // Handle case where API returns something other than an array
          throw new Error('Data retrieved is not a list.');
        }
      } catch (err) {
        // Log the error and update the error state
        console.error("Failed to fetch users:", err);
        setError(err.message || 'An unknown error occurred.');
        setUsers([]); // Clear users on error
      } finally {
        // This runs whether the fetch was successful or failed
        setIsLoading(false);
      }
    };

    fetchUsers();
    
    // The empty dependency array ensures this effect runs only ONCE after the initial render.
  }, []); 
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <div>
      <label for="cars">Choose a car:</label>
      <select name="cars" id="cars">
          {users.map((userString, index) => (
            <option value={index}> **`{userString}`** </option>
          ))}
      </select>
      <br></br>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
