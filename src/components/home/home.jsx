import React, { useState, useEffect } from 'react';
import styles from './home.module.css';
import Search from '../search /search';
import { useHistory } from 'react-router-dom';
import Header from '../header/header';

const Home = ({ authService, weatherService }) => {
  const history = useHistory();
  const historyState = history.location.state;
  const [userId, setUserId] = useState(historyState && historyState.id);

  const [currentWeather, setCurrentWeather] = useState({
    location: null,
    temp: null,
    weather: null,
  });

  const [date, setDate] = useState({
    day: null,
    monthAndDate: null,
    year: null,
  });

  // 검색된 도시 날씨 정보 가져오기
  const getSearchWeather = async (city) => {
    const result = await weatherService.getWeather(city);
    setCurrentWeather({
      location: result.name,
      temp: Math.floor(result.main.temp),
      weather: result.weather[0].main,
    });
  };

  // 현재 날짜 구하기
  useEffect(() => {
    const today = new Date();
    const day = today.getDay();
    const month = String(today.getMonth() + 1).padStart(2, 0);
    const date = String(today.getDate()).padStart(2, 0);
    const monthAndDate = `${month}th${date}`;
    const year = today.getFullYear();

    const dayArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    setDate({
      day: dayArray[day],
      monthAndDate: monthAndDate,
      year: year,
    });
  }, []);

  //현재 위치의 날씨 정보 불러오기
  useEffect(() => {
    const geoSuccess = async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const data = await weatherService.getCurrentWeather(lat, lon);
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

  const onLogout = () => {
    authService.logout();
  };

  // authService
  useEffect(() => {
    authService.onAuthChange((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        history.push('/');
      }
    });
  }, [authService, history]);

  return (
    <div
      className={`${styles.home} ${getWeatherImage(currentWeather.weather)}`}
    >
      <Header onLogout={onLogout} />
      <div className={styles.info}>
        <div className={styles.weather_wrapper}>
          <p className={styles.location}>
            <i className="fa-solid fa-location-dot"></i>
            <strong>{currentWeather.location}</strong>
          </p>

          <p className={styles.temp}>{currentWeather.temp}℃</p>

          <p className={styles.weather}>{currentWeather.weather}</p>
        </div>

        <div className={styles.date}>
          <span className={styles.day}>{date.day}</span>
          <span className={styles.today}>{date.monthAndDate}</span>
          <span className={styles.year}>{date.year}</span>
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
};

export default Home;
