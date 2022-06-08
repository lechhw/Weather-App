import React, { useEffect, useState } from 'react';
import styles from './app.module.css';
import Search from './components/search /search';

function App({ weatherService }) {
  const [currentWeather, setCurrentWeather] = useState({
    location: null,
    temp: null,
    weather: null,
  });

  const getSearchWeather = (data) => {
    setCurrentWeather({
      location: data.name,
      temp: Math.floor(data.main.temp),
      weather: data.weather[0].main,
    });
  };

  //현재 위치의 날씨 정보 불러오기
  useEffect(() => {
    const geoSuccess = async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const data = await weatherService.getCurrentWeather(lat, lon);
      console.log(data);
      setCurrentWeather({
        location: data.name,
        temp: Math.floor(data.main.temp),
        weather: data.weather[0].main,
      });
    };

    const geoError = () => {
      alert(new Error('Location information not found.'));
    };
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  }, []);

  return (
    <div className={`${styles.app} ${getWeatherImage(currentWeather.weather)}`}>
      <div className={styles.info}>
        <div className={styles.weather_wrapper}>
          <p className={styles.location}>
            <i className="fa-solid fa-location-dot"></i>
            <strong>{currentWeather.location}</strong>
          </p>

          <p className={styles.temp}>{currentWeather.temp}℃</p>

          <p className={styles.weather}>{currentWeather.weather}</p>
        </div>
      </div>

      <div className={styles.search_section}>
        <Search
          weatherService={weatherService}
          getSearchWeather={getSearchWeather}
        />
      </div>
    </div>
  );

  function getWeatherImage(weather) {
    switch (weather) {
      case 'Thunderstorm ':
        return styles.thunder;
      case 'Drizzle':
        return styles.drizzle;
      case 'Rain':
        return styles.rain;
      case 'Snow':
        return styles.snow;
      case 'Atmosphere':
        return styles.smog;
      case 'Clear':
        return styles.clear;
      case 'Clouds':
        return styles.clouds;

      default:
        return styles.default;
    }
  }
}

export default App;
