# ☀️ Weather App

# Intro

OpenWeatherMap API 를 이용한 날씨 검색 웹 어플리케이션 입니다.<br>
사용자가 검색창에 도시명을 입력하면 해당 도시의 온도,습도,풍속 등의 디테일한 날씨정보를 알려주며, 날씨에 따라 그에 맞는 이미지의 배경으로 전환됩니다. <br>
Firebase 의 Authentication 서비스를 이용하여 이메일주소와 비밀번호를 사용한 로그인 및 회원가입 기능과 소셜로그인 기능을 구현하였고, 
북마크기능을 추가하여 Realtime database 에 유저 uid 별로 사용자가 즐겨찾는 도시를 저장할 수 있습니다. <br>
또한 mount 가 되면 Date()함수를 사용하여 오늘 날짜를 보여주고, getCurrentPosition()함수를 사용하여 현재 위치의 날씨 정보를 보여줍니다.<br>

<br>

## Live Demo : [Weather App](https://lechhw-weather-app.netlify.app)

작업기간

- 2022.06.07 ~ 2022.06.09 1차 배포
- 2022.06.21 ~ 2022.06.27 (React Router 도입, 로그인기능 추가, 북마크 기능 추가, 로딩 스피너 추가, UI 수정)

<br>

# Skills

- [x] React

  - React Functional Component

- [x] React Router
- [x] Firebase
  - Authentication
  - Realtime database
- [x] PostCSS
- [x] Postman

<br>

# Preview

## Login & Sign up

<img src="https://user-images.githubusercontent.com/99241230/175861157-d24434ad-e5e6-4ada-8963-6918ffbb68e4.gif">

<br>

## Error Handling

<img src="https://user-images.githubusercontent.com/99241230/175876407-340361a2-005b-4b23-8f88-37e0856d375f.gif">

<br>

## Search & Bookmark

<img src="https://user-images.githubusercontent.com/99241230/175862371-4c75ebfa-1135-4258-867e-cce8721b6c61.gif">

<br>

## Responsive Web

<img src="https://user-images.githubusercontent.com/99241230/175862568-5706456e-08ed-4ab1-b22b-768688163372.gif">

<br>

# Solution

## ✅ OpenWeatherMap API

Postman 을 이용하여 API 통신 테스트 후 받아온 fetch 코드를 사용하였습니다.<br>
또한 service 로직은 컴포넌트 파일에 함께 작성하지 않고, service 폴더를 생성해 따로 분리하여 작성하였습니다.<br>
현재 위치의 날씨정보는 위도와 경도 인자값을 전달하여 데이터를 받아오고, 검색한 도시의 날씨정보는 도시명을 인자값을 전달하여 데이터를 받아옵니다.

```js
// weather.js

class Weather {
  // 위도,경도 로 data 받아오기
  async getCurrentWeather(lat, lon) {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
      requestOptions
    );

    const data = await result.json();
    return data;
  }

  // 도시명으로 data 받아오기
  async getWeather(city) {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`,
      requestOptions
    );

    const data = await result.json();
    return data;
  }
}

export default Weather;
```

<br>

## ✅ Firebase Authentication

로그인 하는데 필요한 firebaseAuth 를 import 해서 `signInWithPopup()`, `signOut()` 함수를 호출해줍니다. <br>
해당 프로젝트에서는 소셜로그인기능과 이메일주소와 비밀번호를 사용해 신규사용자가입 & 로그인 기능을 사용하기 때문에 `createUserWithEmailAndPassword()`, `signInWithEmailAndPassword()` 함수도 호출해줍니다.

```js
// auth_service.js

import { firebaseAuth, githubProvider, googleProvider } from './firebase';

class AuthService {
  login(providerName) {
    const provider = this.getProvider(providerName);
    return firebaseAuth.signInWithPopup(provider);
  }

  logout() {
    firebaseAuth.signOut();
  }

  createUser(email, password) {
    return firebaseAuth.createUserWithEmailAndPassword(email, password);
  }

  signInUser(email, password) {
    return firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  // auth 관찰자 . 유저 상태에 변화가 있으면 user 정보를 담아 onUserchange 콜백함수를 리턴한다.
  onAuthChange(onUserChange) {
    firebaseAuth.onAuthStateChanged((user) => {
      onUserChange(user);
    });
  }

  getProvider(providerName) {
    switch (providerName) {
      case 'Google':
        return googleProvider;
      case 'Github':
        return githubProvider;

      default:
        throw new Error(`not supported provider: ${providerName}`);
    }
  }
}

export default AuthService;
```

<br>

## ✅ Firebase Realtime Database

database 와 관련된 것들은 BookmarkDB 클래스의 멤버함수로 정의해주었습니다.<br>
`saveBookmark()` 와 `removeBookmark()` 함수는 원하는 경로(ref)에 데이터를 저장하고(set) 제거(remove) 해줍니다.<br>
`syncBookmark()` 함수는 경로(ref)에 snapshot 이라는 리스너를 등록해 변경사항을 인식하고, 데이터가 존재하면 등록된 `onUpdate()` 라는 콜백함수를 호출해줍니다.
또한 ref.off() 라는 리스너를 제거해주는 함수를 리턴해주어 해당함수를 받는곳에서(useEffect) cleanup 함수로 등록하여 unmount 가 되면 리스너가 제거됩니다.

```js
// bookmark_db.js

import { firebaseDatabase } from './firebase';

class BookmarkDB {
  saveBookmark(userId, card) {
    firebaseDatabase.ref(`${userId}/bookmark/${card.id}`).set(card);
  }

  removeBookmark(userId, card) {
    firebaseDatabase.ref(`${userId}/bookmark/${card.id}`).remove();
  }

  syncBookmark(userId, onUpdate) {
    const ref = firebaseDatabase.ref(`${userId}/bookmark`);
    ref.on('value', (snapshot) => {
      const value = snapshot.val();
      value && onUpdate(value);
    });
    return () => ref.off();
  }
}

export default BookmarkDB;
```

<br>

## ✅ Login & Sign up

CreateForm 컴포넌트를 분리하여 작성후 로그인 컴포넌트 하단에 토글버튼을 클릭하여 CreateForm 컴포넌트와 Login 컴포넌트가 전환 될 수 있도록 구현하였습니다.
또한 email, password 로그인 및 회원가입시 에러가 발생하면 에러코드를 화면에 구현하여 사용자가 에러를 인지할 수 있게 하였습니다.

```js
const Login = ({ authService }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [createForm, setCreateForm] = useState(false);

  // ..생략

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

  // ..생략

  return (
    <section className={styles.login}>
      // ...생략

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

          // ... 생략

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


    </section>
  );
};

export default Login;
```

```js
const CreateForm = ({ authService }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ...생략

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
```

<br>

## ✅ getCurrentPosition()

`getCurrentPosition()` 메서드를 사용하여 mount 가 되면 현재 위치의 위도(lat)와 경도(lon) 를 받아와 받아온 정보로 해당위치의 날씨정보를 받아왔습니다.

```js
// home.js

//현재 위치의 날씨 정보 불러오기
useEffect(() => {
  const geoSuccess = async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const data = await weatherService.getCurrentWeather(lat, lon);
    setLoading(false);

    setCurrentWeather({
      location: data.name,
      temp: Math.floor(data.main.temp),
      weather: data.weather[0].main,
      tempMax: Math.floor(data.main.temp_max),
      tempMin: Math.floor(data.main.temp_min),
      humidity: data.main.humidity,
      windSpeed: Math.floor(data.wind.speed),
    });
  };
  const geoError = () => {
    alert(new Error('Location information not found.'));
  };

  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}, []);
```

<br>

## ✅ Add Bookmark

bookmark 에 추가하기 전에 기존에 북마크에 동일한 도시가 있다면 중복 추가가 안되도록 제한하였습니다.

```js
// home.js

// 북마크에 추가
const addBookmark = (card) => {
  setBookmark((bookmark) => {
    const updated = { ...bookmark };
    updated[card.id] = card;
    return updated;
  });
  bookmarkDB.saveBookmark(userId, card);
};

const onClickBookmark = () => {
  const city = locationRef.current.textContent;
  const card = {
    id: Date.now(),
    location: city,
  };
  // 북마크에 동일한 도시가 있으면 중복 추가 X
  if (Object.values(bookmark).some((item) => item.location === city)) {
    return;
  }
  addBookmark(card);
};
```

