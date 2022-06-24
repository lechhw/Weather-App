import React, { useRef, useState } from 'react';
import BookmarkList from '../bookmark_list/bookmark_list';
import Details from '../details/details';
import styles from './search.module.css';

const Search = ({
  getCityWeather,
  currentWeather,
  bookmark,
  deleteBookmark,
}) => {
  const inputRef = useRef();

  const onSubmit = async (e) => {
    e.preventDefault();
    const city = inputRef.current.value;
    inputRef.current.value = '';
    getCityWeather(city);
  };

  return (
    <section className={styles.searchForm}>
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
          <option value="Prague" label="프라하"></option>
          <option value="Berlin" label="베를린"></option>
          <option value="Tokyo" label="도쿄"></option>
          <option value="Osaka" label="오사카"></option>
          <option value="Shanghai" label="상하이"></option>
          <option value="Beijing" label="베이징"></option>
          <option value="Sydney" label="시드니"></option>
          <option value="Singapore" label="싱가포르"></option>
          <option value="Bangkok" label="방콕"></option>
          <option value="Amsterdam" label="암스테르담"></option>
          <option value="Dubai" label="두바이"></option>
        </datalist>

        <button className={styles.button}>
          <i className="fa-solid fa-magnifying-glass-location"></i>
        </button>
      </form>

      <div className={styles.bookmarkList}>
        <h3 className={styles.title}>Bookmark List</h3>
        <ul className={styles.cityList}>
          {Object.keys(bookmark).map((card) => (
            <BookmarkList
              card={bookmark[card]}
              key={card}
              getCityWeather={getCityWeather}
              deleteBookmark={deleteBookmark}
            />
          ))}
        </ul>
      </div>

      <div className={styles.wrapper}>
        <h3 className={styles.title}>Weather Details</h3>
        <Details currentWeather={currentWeather} />
      </div>
    </section>
  );
};

export default Search;
