import React from 'react';
import styles from './header.module.css';

const Header = ({ onLogout }) => {
  return (
    <header className={styles.header}>
      <img className={styles.logo} src="./images/logo.svg" alt="logo" />
      <h1 className={styles.title}>Weather App</h1>

      {onLogout && <button onClick={onLogout}>Logout</button>}
    </header>
  );
};

export default Header;
