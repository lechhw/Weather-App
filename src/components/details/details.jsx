import React from 'react';
import styles from './details.module.css';

const Details = ({ currentWeather }) => {
  const { weather, tempMax, tempMin, humidity, windSpeed } = currentWeather;

  return (
    <dl className={styles.details}>
      <div className={styles.info}>
        <dt>Weather :</dt>
        <dd>{weather}</dd>
      </div>

      <div className={styles.info}>
        <dt>Max/Min Temp :</dt>
        <dd>{`${tempMax || ''}℃ / ${tempMin || ''}℃`}</dd>
      </div>

      <div className={styles.info}>
        <dt>Humidity :</dt>
        <dd>{`${humidity || ''} %`}</dd>
      </div>

      <div className={styles.info}>
        <dt>Wind Speed :</dt>
        <dd>{`${windSpeed || ''} m/s`}</dd>
      </div>
    </dl>
  );
};

export default Details;
