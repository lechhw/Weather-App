# Weather App

# Intro

OpenWeatherMap API 를 이용한 날씨 검색 웹 어플리케이션 입니다.<br>
Date()함수를 사용하여 오늘 날짜를 보여주고, getCurrentPosition()함수를 사용하여 현재 위치 정보를 받아와 <br>
그 정보를 바탕으로 해당위치의 날씨정보에 맞는 배경화면 이미지와 함께 보여줍니다.<br>
또한 사용자가 검색창에 도시명을 입력하면 해당 도시의 온도,습도,풍속 등의 디테일한 날씨정보를 알려줍니다.

<br>

## Live Demo : [Business Card Maker](https://lechhw-weather-app.netlify.app)

작업기간 (2022.06.07 ~ 2022.06.09)

<br>

# Skills

- [x] React

  - React Functional Component

- [x] PostCSS
- [x] Postman

<br>

# Preview

## Search

<img src="https://user-images.githubusercontent.com/99241230/172650573-116df0ab-6b9e-49ac-98a4-3e1aa0d759f0.gif">

<br>

## Responsive Web

<img src="https://user-images.githubusercontent.com/99241230/174286058-2d452727-67a8-4f45-9eba-9b8d20c9833c.gif">

<br>

# Solution

- Postman 을 이용하여 API 통신 테스트 후에 fetch 함수를 사용하였습니다.
  또한 service 로직은 컴포넌트 파일에 함께 작성하지 않고, service 폴더를 생성해 따로 분리하여 작성하였습니다.

```js
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
```

<br>

- getCurrentPosition() 메서드를 사용하여 페이지가 road 되면 현재 위치 정보를 받아와서 현위치의 날씨정보를 화면에 구현하였습니다.

```js
//현재 위치의 날씨 정보 불러오기
useEffect(() => {
  const geoSuccess = async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const data = await weatherService.getCurrentWeather(lat, lon);
    setCurrentWeather({
      location: data.name,
      temp: Math.floor(data.main.temp),
      weather: data.weather[0].main,
    });
  };

  const geoError = () => {
    alert(new Error('Location information not found.'));
  };
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}, []);
```

<img with="50" height="300" src="https://user-images.githubusercontent.com/99241230/172650541-d352d851-5454-48e8-a9a3-a6c9f3345ae4.png">

<br>

- 도시명 입력시 입력한 값을 파라미터로 전달하여 해당도시의 날씨정보를 받아옵니다.
  받아온 날씨정보를 useState() 를 사용하여 값을 넣어주고 해당내용을 화면에 보여주었습니다.

```js
// Search

const [detailInfo, setDetailInfo] = useState({
  weather: null,
  tempMax: null,
  tempMin: null,
  humidity: null,
  windSpeed: null,
});

const onSubmit = async (e) => {
  e.preventDefault();

  let city = inputRef.current.value;
  inputRef.current.value = '';

  getSearchWeather(city);

  const data = await weatherService.getWeather(city);
  setDetailInfo({
    weather: data.weather[0].main,
    tempMax: Math.floor(data.main.temp_max),
    tempMin: Math.floor(data.main.temp_min),
    humidity: data.main.humidity,
    windSpeed: Math.floor(data.wind.speed),
  });
};
```

<br>

- Switch 를 사용하여 main 날씨 값에 따라 className 을 각각 다르게 추가로 붙여주어 해당하는 날씨 정보에 어울리는 배경이미지로 보여지게끔 하였습니다.

```js
function getWeatherImage(weather) {
  switch (weather) {
    case 'Thunderstorm ':
      return styles.thunder;
    case 'Drizzle':
      return styles.drizzle;
    case 'Rain':
      return styles.rain;
    case 'Snow':
      return styles.snow;
    case 'Atmosphere':
      return styles.smog;
    case 'Clear':
      return styles.clear;
    case 'Clouds':
      return styles.clouds;
    default:
      return styles.default;
  }
}
```
