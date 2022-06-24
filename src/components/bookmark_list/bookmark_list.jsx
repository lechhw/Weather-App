import React from 'react';
import styles from './bookmark_list.module.css';

const BookmarkList = ({ card, getCityWeather, deleteBookmark }) => {
  const onClick = (e) => {
    const city = e.target.textContent;
    getCityWeather(city);
  };

  return (
    <li className={styles.item}>
      <div className={styles.city} onClick={onClick}>
        <i className="fa-solid fa-location-dot"></i>
        <span className={styles.name}>{card.location}</span>
      </div>
      <button onClick={() => deleteBookmark(card)} className={styles.button}>
        ⓧ
      </button>
    </li>
  );
};

export default BookmarkList;
