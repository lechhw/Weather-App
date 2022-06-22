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
          list="cityList"
          className={styles.input}
          ref={inputRef}
          type="text"
          placeholder="Search"
        />
        <datalist id="cityList" className={styles.dataList}>
          <option value="Seoul" label="서울"></option>
          <option value="New York" label="뉴욕"></option>
          <option value="Chicago" label="시카고"></option>
          <option value="London" label="런던"></option>
          <option value="Milan" label="밀라노"></option>
          <option value="Madrid" label="마드리드"></option>
          <option value="Vienna" label="비엔나"></option>
          <option value="Prague" label="프라하"></option>
          <option value="Berlin" label="베를린"></option>
          <option value="Tokyo" label="도쿄"></option>
          <option value="Osaka" label="오사카"></option>
          <option value="Hong Kong" label="홍콩"></option>
          <option value="Shanghai" label="상하이"></option>
          <option value="Beijing" label="베이징"></option>
          <option value="Sydney" label="시드니"></option>
          <option value="Melbourne" label="멜버른"></option>
          <option value="Singapore" label="싱가포르"></option>
          <option value="Bangkok" label="방콕"></option>
          <option value="Manila" label="마닐라"></option>
          <option value="Amsterdam" label="암스테르담"></option>
          <option value="Toronto" label="토론토"></option>
          <option value="São Paulo" label="상파울로"></option>
          <option value="Dubai" label="두바이"></option>
          <option value="Moscow" label="모스크바"></option>
        </datalist>
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
