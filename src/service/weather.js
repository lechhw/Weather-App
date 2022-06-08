const API_KEY = process.env.REACT_APP_API_KEY;

class Weather {
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
