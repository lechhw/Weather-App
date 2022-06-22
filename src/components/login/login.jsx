import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../header/header';
import CreateForm from './create_form/create_form';
import styles from './login.module.css';

const Login = ({ authService }) => {
  const formRef = useRef();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [createForm, setCreateForm] = useState(false);

  const goToHome = (userId) => {
    history.push({
      pathname: '/home',
      state: {
        id: userId,
      },
    });
  };

  // 소셜 로그인
  const onLogin = (e) => {
    const providerName = e.target.name;
    authService.login(providerName).then((result) => goToHome(result.user.uid));
  };

  // email, password 로그인
  const onSubmit = async (e) => {
    e.preventDefault();
    authService
      .signInUser(email, password)
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

  useEffect(() => {
    authService.onAuthChange((user) => {
      user && goToHome(user.uid);
    });

    // user 데이터가 인식되면 Home 컴포넌트로 이동
  }, [authService]);

  return (
    <section className={styles.login}>
      <div className={styles.loginForm}>
        <div className={styles.header}>
          <Header />
        </div>

        <div className={styles.greeting}>
          <h1 className={styles.title}>
            {createForm ? 'Create an account' : 'Log in'}
          </h1>

          {!createForm && (
            <p className={styles.guide}>
              Welcome back! Please enter your details.
            </p>
          )}
        </div>

        {!createForm ? (
          <div className={styles.container}>
            <form ref={formRef} onSubmit={onSubmit} className={styles.form}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={onChange}
                required
                className={styles.input}
                autoComplete="off"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={onChange}
                required
                className={`${styles.input} ${styles.pw}`}
                autoComplete="off"
              />

              {error && <p className={styles.error}>{`⚠️ ${error}`}</p>}

              <button className={`${styles.button} ${styles.signBtn}`}>
                Sign in
              </button>
            </form>

            <p className={styles.divider}>OR</p>

            <ul className={styles.providerList}>
              <li className={styles.providerItem}>
                <button
                  className={`${styles.button} ${styles.providerBtn}`}
                  name="Google"
                  onClick={onLogin}
                >
                  <img src="./images/google.png" alt="google" />
                  Continue With Google
                </button>
              </li>

              <li className={styles.providerItem}>
                <button
                  className={`${styles.button} ${styles.providerBtn}`}
                  name="Github"
                  onClick={onLogin}
                >
                  <img src="./images/github.png" alt="github" />
                  Continue With Github
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <CreateForm authService={authService} />
        )}

        <div className={styles.accountGuide}>
          <p>
            {createForm
              ? 'Already have an account? '
              : "Don't have an account?"}
          </p>

          <button
            className={`${styles.button} ${styles.toggleBtn}`}
            onClick={() => {
              setCreateForm((prev) => !prev);
            }}
          >
            {createForm ? 'Log in' : 'Sign Up'}
          </button>
        </div>
      </div>

      <div className={styles.illustration}>
        <img src="./images/illustration.svg" alt="illustration" />
      </div>
    </section>
  );
};

export default Login;
