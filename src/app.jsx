import React, { useEffect, useRef } from 'react';
import './app.css';

function App({ weatherService }) {
  const inputRef = useRef();

  const getData = (e) => {
    e.preventDefault();
    const city = inputRef.current.value;
    weatherService.getWeather(city).then(console.log);
  };

  useEffect(() => {
    const geoSuccess = (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      weatherService.getCurrentWeather(lat, lon).then(console.log);
    };

    const geoError = () => {};
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  }, []);

  return (
    <form onSubmit={getData}>
      <input ref={inputRef} type="text"></input>
    </form>
  );
}

export default App;
