const apiKey = '7e9df764fef97426d3a7f538fd075c98'; // Sử dụng API key của bạn
let units = 'metric'; // Đơn vị mặc định là Celsius (°C)
const cities = new Set();

function addCity() {
  const input = document.getElementById('cityInput');
  const cityName = input.value.trim();

  if (!cityName || cities.has(cityName.toLowerCase())) {
    input.value = '';
    return;
  }

  fetchWeatherData(cityName);
  input.value = '';
}

function fetchWeatherData(cityName) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        alert('Không tìm thấy thành phố!');
        return;
      }

      cities.add(data.name.toLowerCase());
      showSuccessMessage();
      createWeatherCard(data);
      fetchForecast(data.coord.lat, data.coord.lon);
    })
    .catch(() => alert('Lỗi khi lấy thông tin thời tiết'));
}

function fetchForecast(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`)
    .then(res => res.json())
    .then(data => {
      createForecastCards(data.daily);
    })
    
}

function createWeatherCard(data) {
  const container = document.getElementById('cards');

  const card = document.createElement('div');
  card.className = 'weather-card';

  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  // Lấy giờ bình minh và hoàng hôn theo định dạng dễ đọc
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

  card.innerHTML = `
    <button class="close-btn" onclick="removeCard(this, '${data.name.toLowerCase()}')">&times;</button>
    <h2><img src="${iconUrl}" alt="">${data.name}</h2>
    <p>${data.main.temp.toFixed(2)}° ${units === 'metric' ? 'C' : 'F'}</p>
    <p>${data.weather[0].description}</p>
    <p><strong>Độ ẩm:</strong> ${data.main.humidity}%</p>
    <p><strong>Tốc độ gió:</strong> ${data.wind.speed} m/s</p>
    <p><strong>Áp lực:</strong> ${data.main.pressure} hPa</p>
    
    <p><strong>Bình minh:</strong> ${sunrise}</p>
    <p><strong>Hoàng hôn:</strong> ${sunset}</p>
  `;

  container.appendChild(card);
}

function createForecastCards(forecastData) {
  const container = document.getElementById('forecast-cards');
  container.innerHTML = ''; // Xóa các thẻ cũ

  forecastData.forEach((day, index) => {
    const card = document.createElement('div');
    card.className = 'weather-card';

    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    const date = new Date(day.dt * 1000).toLocaleDateString();

    card.innerHTML = `
      <h2>${date}</h2>
      <img src="${iconUrl}" alt="">
      <p>${day.temp.day.toFixed(2)}° ${units === 'metric' ? 'C' : 'F'}</p>
      <p>${day.weather[0].description}</p>
    `;

    container.appendChild(card);
  });
}

function showSuccessMessage() {
  const msg = document.getElementById('successMessage');
  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 2000);
}

function removeCard(btn, cityName) {
  btn.parentElement.remove();
  cities.delete(cityName);
}
