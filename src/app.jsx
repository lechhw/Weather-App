import React from 'react';
import styles from './app.module.css';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Home from './components/home/home';
import Login from './components/login/login';

function App({ authService, weatherService, bookmarkDB }) {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <Login authService={authService} />
          </Route>

          <Route path="/home">
            <Home
              authService={authService}
              weatherService={weatherService}
              bookmarkDB={bookmarkDB}
            />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
