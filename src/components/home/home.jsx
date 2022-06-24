import React, { useState, useEffect, useRef } from 'react';
import styles from './home.module.css';
import Search from '../search /search';
import { useHistory } from 'react-router-dom';
import Header from '../header/header';
import DateForm from '../date_form/date_form';

const Home = ({ authService, weatherService, bookmarkDB }) => {
  const locationRef = useRef();
  const history = useHistory();
  // login 컴포넌트에서 받아온 유저정보를 historyState 에 저장
  const historyState = history.location.state;
  const [userId, setUserId] = useState(historyState && historyState.id);
  const [bookmark, setBookmark] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentWeather, setCurrentWeather] = useState([
    {
      location: '',
      temp: '',
      weather: '',
      tempMax: '',
      tempMin: '',
      humidity: '',
      windSpeed: '',
    },
  ]);

  // 북마크에서 해제
  const deleteBookmark = (card) => {
    setBookmark((bookmark) => {
      const updated = { ...bookmark };
      delete updated[card.id];
      return updated;
    });
    bookmarkDB.removeBookmark(userId, card);
  };

  // 북마크에 추가
  const addBookmark = (card) => {
    setBookmark((bookmark) => {
      const updated = { ...bookmark };
      updated[card.id] = card;
      return updated;
    });
    bookmarkDB.saveBookmark(userId, card);
  };

  const onClickBookmark = () => {
    const city = locationRef.current.textContent;
    const card = {
      id: Date.now(),
      location: city,
    };
    // 북마크에 동일한 도시가 있으면 중복 추가 X
    if (Object.values(bookmark).some((item) => item.location === city)) {
      return;
    }
    addBookmark(card);
  };

  // 검색된 도시 날씨 정보 가져오기
  const getCityWeather = async (city) => {
    const data = await weatherService.getWeather(city);
    setCurrentWeather({
      location: data.name,
      temp: Math.floor(data.main.temp),
      weather: data.weather[0].main,
      tempMax: Math.floor(data.main.temp_max),
      tempMin: Math.floor(data.main.temp_min),
      humidity: data.main.humidity,
      windSpeed: Math.floor(data.wind.speed),
    });
  };

  //현재 위치의 날씨 정보 불러오기
  useEffect(() => {
    const geoSuccess = async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const data = await weatherService.getCurrentWeather(lat, lon);
      setLoading(false);
      setCurrentWeather({
        location: data.name,
        temp: Math.floor(data.main.temp),
        weather: data.weather[0].main,
        tempMax: Math.floor(data.main.temp_max),
        tempMin: Math.floor(data.main.temp_min),
        humidity: data.main.humidity,
        windSpeed: Math.floor(data.wind.speed),
      });
    };
    const geoError = () => {
      alert(new Error('Location information not found.'));
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  }, []);

  // logout
  const onLogout = () => {
    authService.logout();
  };

  // sync database
  useEffect(() => {
    if (!userId) {
      return;
    }
    const stopSync = bookmarkDB.syncBookmark(userId, (value) => {
      setBookmark(value);
    });

    // unmount 되면 sync off
    return () => stopSync();
  }, [userId, bookmarkDB]);

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
    <section
      className={`${styles.home} ${getWeatherImage(currentWeather.weather)}`}
    >
      {loading && <div className={styles.loading}></div>}

      <div className={styles.header}>
        <Header onLogout={onLogout} />
        <div className={styles.date}>
          <DateForm />
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.weatherInfo}>
            <div className={styles.location}>
              <button
                onClick={onClickBookmark}
                className={styles.bookmarkBtn}
                title="Bookmark"
              >
                <i className="fa-solid fa-location-dot"></i>
              </button>

              <strong ref={locationRef}>{currentWeather.location || ''}</strong>
            </div>

            <div className={styles.mainWeather}>
              <span className={styles.temp}>{`${
                currentWeather.temp || ''
              }℃`}</span>

              <span className={styles.weather}>
                {currentWeather.weather || ''}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.search_section}>
          <Search
            getCityWeather={getCityWeather}
            currentWeather={currentWeather}
            bookmark={bookmark}
            deleteBookmark={deleteBookmark}
          />
        </div>
      </div>
    </section>
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
      case 'Mist':
        return styles.mist;

      default:
        return styles.default;
    }
  }
};

export default Home;
