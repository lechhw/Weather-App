import React, { useState } from 'react';
import styles from './create_form.module.css';
import { useHistory } from 'react-router-dom';

const CreateForm = ({ authService }) => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const goToHome = (userId) => {
    history.push({
      pathname: '/home',
      state: {
        id: userId,
      },
    });
  };

  // 계정 생성
  const onSubmit = (e) => {
    e.preventDefault();

    authService
      .createUser(email, password)
      .then((result) => goToHome(result.user.uid))
      .catch((error) => {
        setError(error.message);
      });
  };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={onChange}
        required
        autoComplete="off"
        className={styles.input}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={onChange}
        required
        autoComplete="off"
        className={`${styles.input} ${styles.pw}`}
      />

      {error && <p className={styles.error}>{`⚠️ ${error}`}</p>}

      <button className={styles.button}>Create account</button>
    </form>
  );
};

export default CreateForm;
