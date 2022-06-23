import React from 'react';
import styles from './header.module.css';

const Header = ({ onLogout }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img className={styles.logoImg} src="./images/logo.svg" alt="logo" />
        <h1 className={styles.title}>Weather App</h1>
      </div>

      {onLogout && (
        <button className={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
