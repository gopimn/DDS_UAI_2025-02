
import './App.css'
import { useState, useEffect } from 'react';

const App = () => {
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

  // --- RENDERING LOGIC ---

  if (isLoading) {
    return (
      <div className="user-list-container">
        <p>Loading user data... ⏳</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list-container">
        <h2>Error! ❌</h2>
        <p>Could not load users from **`{API_URL}`**.</p>
        <p>Details: **`{error}`**</p>
        <p>Please ensure your local server is running on port 3000.</p>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <h1>Users List (from API)</h1>
      {users.length > 0 ? (
        <ul>
          {/* Map over the array and create a list item for each string */}
          {users.map((userString, index) => (
            <li key={index}>**`{userString}`**</li>
          ))}
        </ul>
      ) : (
        <p>No users found. The API returned an empty list. 😟</p>
      )}
    </div>
  );
};

export default App


       //</div> <option value="volvo">Volvo</option>
      //</> <option value="saab">Saab</option>
      //  <option value="opel">Opel</option>
       // <option value="audi">Audi</option