// https://www.youtube.com/watch?v=v9gsMFozXK0&t=2761s
import { useEffect } from 'react';
import { OpenWeatherAPI } from "openweather-api-node";
import './App.css'

const App = () => {
    const apiKey = process.env.OPENWEATH;
    if (apiKey) {
      console.log('asdjasbdhja  KEY PRESENT');
    } else {
      console.warn('API_KEY environment variable is not set.');
    }

    let weather = new OpenWeatherAPI({
        key: apiKey,
        locationName: "Santiago",
        units: "metric" // universal?
    });

    useEffect(() => {
    try {

    /* 
    you can use setters as well:
    weather.setKey("put-key-here")
    weather.setLocationByName("New York")
    ...
    */

    weather.getCurrent().then(data => {
        console.log(`Current temperature in New York is: ${data.weather.temp.cur}\u00B0F`)
    });

    return (
          <label>
            First name:
            {/* <input
              value={data.weather.temp.cur}
              onChange={e => {
                setForm({
                  ...form,
                  firstName: e.target.value
                });
              }}
            /> */}
          </label>      
    );
    }
    catch (err) {
      // Log the error and update the error state
      console.error("CATCH!!!! :", err);
      setError(err.message || 'An unknown error occurred.');
      setUsers([]); // Clear users on error
    } finally {
      // This runs whether the fetch was successful or failed
      setIsLoading(false);
    }
    }, []); 

  }

export default App
