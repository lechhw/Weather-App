import React, { useRef, useState } from 'react';
import styles from './search.module.css';

const Search = ({ weatherService, getSearchWeather }) => {
  const inputRef = useRef();
  const [detailInfo, setDetailInfo] = useState({
    weather: null,
    tempMax: null,
    tempMin: null,
    humidity: null,
    windSpeed: null,
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    let city = inputRef.current.value;
    inputRef.current.value = '';

    getSearchWeather(city);

    const data = await weatherService.getWeather(city);
    setDetailInfo({
      weather: data.weather[0].main,
      tempMax: Math.floor(data.main.temp_max),
      tempMin: Math.floor(data.main.temp_min),
      humidity: data.main.humidity,
      windSpeed: Math.floor(data.wind.speed),
    });
  };

  return (
    <section className={styles.container}>
      <form className={styles.form} onSubmit={onSubmit}>
        <input
          className={styles.input}
          ref={inputRef}
          type="text"
          placeholder="Search"
        ></input>
        <button className={styles.button}>
          <i className="fa-solid fa-magnifying-glass-location"></i>
        </button>
      </form>

      <div className={styles.wrapper}>
        <h3 className={styles.title}>Weather Details</h3>

        <dl className={styles.details}>
          <div className={styles.info}>
            <dt>Weather</dt>
            <dd>{detailInfo.weather}</dd>
          </div>
          <div className={styles.info}>
            <dt>Max/Min Temp</dt>
            <dd>
              {detailInfo.tempMax}℃ / {detailInfo.tempMin}℃
            </dd>
          </div>
          <div className={styles.info}>
            <dt>Humidity</dt>
            <dd>{detailInfo.humidity} %</dd>
          </div>
          <div className={styles.info}>
            <dt>Wind Speed</dt>
            <dd>{detailInfo.windSpeed} m/s</dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default Search;
