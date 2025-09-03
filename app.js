const apiKey = "9e08da36af6297ae50bfcda84496c238"; // your API key

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const url = (city) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

async function getWeatherByLocation(city) {
  try {
    const resp = await fetch(url(city));
    const respData = await resp.json();

    if (respData.cod === "404") {
      main.innerHTML = `<p style="color:white;font-size:1.2rem;">❌ City not found</p>`;
    } else {
      addWeatherToPage(respData);
    }
  } catch (error) {
    main.innerHTML = `<p style="color:white;font-size:1.2rem;">⚠️ Error fetching data</p>`;
  }
}

// 🌦️ Background changer
function changeBackground(weather) {
  document.body.className = ""; // reset classes

  if (weather.includes("clear")) {
    document.body.classList.add("sunny");
  } else if (weather.includes("cloud")) {
    document.body.classList.add("cloudy");
  } else if (weather.includes("rain")) {
    document.body.classList.add("rainy");
  } else if (weather.includes("storm") || weather.includes("thunder")) {
    document.body.classList.add("stormy");
  } else if (weather.includes("snow")) {
    document.body.classList.add("snowy");
  }
}

// 🔊 Voice function
function speakWeather(city, temp, condition) {
  const message = `Today in ${city}, it is ${Math.round(
    temp
  )} degrees Celsius with ${condition}.`;
  const speech = new SpeechSynthesisUtterance(message);
  speech.lang = "en-US"; // you can change to "en-GB" for British accent, etc.
  window.speechSynthesis.speak(speech);
}

function addWeatherToPage(data) {
  const temp = data.main.temp;
  const condition = data.weather[0].description.toLowerCase();

  const weather = document.createElement("div");
  weather.classList.add("weather");

  weather.innerHTML = `
    <h2>
      <img src="https://openweathermap.org/img/wn/${
        data.weather[0].icon
      }@2x.png" />
      ${data.name} – ${temp.toFixed(2)}°C
    </h2>
    <small>${data.weather[0].main}</small>
  `;

  main.innerHTML = ""; // clear old content
  main.appendChild(weather);

  // 🌦️ Change background
  changeBackground(condition);

  // 🔊 Speak weather
  speakWeather(data.name, temp, condition);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = search.value.trim();
  if (city) {
    getWeatherByLocation(city);
  }
});
