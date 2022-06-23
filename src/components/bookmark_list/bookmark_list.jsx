import React from 'react';
import styles from './bookmark_list.module.css';

const BookmarkList = ({ card, getSearchWeather, deleteBookmark }) => {
  const onClick = (e) => {
    const selectCity = e.target.textContent;
    getSearchWeather(selectCity);
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
