const curData = document.getElementById("date_time");
const weather_icon = document.getElementById("icon");
const inputField = document.getElementById("searchInput");

const tempStatus = "{%tempStatus%}";

const setWeatherIcon = (status) => {
  if (tempStatus == "Sunny") {
    weather_icon.innerHTML = `<i class="fa-regular fa-sun" style="color: #f1c40f"></i>`;
  } else if (tempStatus == "Clouds") {
    weather_icon.innerHTML = `<i class="fa-regular fa-solid fa-cloud" style="color: #3498db"></i>`;
  } else if (tempStatus == "Rainy") {
    weather_icon.innerHTML = `<i class="fa-regular fa-solid fa-cloud-rain" style="color: #2980b9"></i>`;
  } else {
    weather_icon.innerHTML = `<i class="fa-regular fa-solid fa-cloud" style="color: #3498db"></i>`;
  }
};

const getCurrentDay = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let currentDay = new Date();
  let day = days[currentDay.getDay()];
  return day;
};

const getCurrentTime = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentTime = new Date();
  let month = months[currentTime.getMonth()];
  let day = currentTime.getDate();
  let hour = currentTime.getHours();
  let minute = currentTime.getMinutes();
  if (minute < 10) {
    minute = "0" + minute;
  }
  let period = "AM";
  if (hour > 11) {
    period = "PM";
    if (hour > 12) {
      hour -= 12;
    }
  }
  return `${month} ${day} | ${hour}:${minute}${period}`;
};

inputField.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const city = inputField.value;
    if (city) {
      fetch(`/?city=${city}`)
        .then((response) => response.text())
        .then((data) => {
          //   document.body.innerHTML = data; // Update the entire body or update specific elements

          //TODO:Think why you are using this...
          // Create a temporary element to extract the needed content
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = data;

          // Update specific elements instead of the entire body
          document.querySelector(".location.country").innerHTML =
            tempDiv.querySelector(".location.country").innerHTML;
          document.querySelector(".temp").innerHTML =
            tempDiv.querySelector(".temp").innerHTML;
          document.querySelector(".min_max_temp").innerHTML =
            tempDiv.querySelector(".min_max_temp").innerHTML;
          document.querySelector("#icon").innerHTML =
            tempDiv.querySelector("#icon").innerHTML;

          curData.innerHTML = getCurrentDay() + " | " + getCurrentTime();
        });
    }
  }
});

// by defaut show the current timing...
curData.innerHTML = getCurrentDay() + " | " + getCurrentTime();

// ==========================================================//
// for the heading animation:
const heading = document.querySelector(".heading");
let rainDropCount = 0; // Counter for rain drops
const maxRainDrops = 30; // Limit to the number of rain drops

function createRainDrop() {
  if (rainDropCount < maxRainDrops) {
    const rainDrop = document.createElement("div");
    rainDrop.classList.add("rain");
    // Randomize position and timing for each drop
    rainDrop.style.left = Math.random() * 100 + "vw";
    rainDrop.style.animationDuration = Math.random() * 0.5 + 0.5 + "s"; // Between 0.5s and 1s
    heading.appendChild(rainDrop);

    // Increment the rain drop count
    rainDropCount++;

    // Remove drop after animation ends and decrease the count
    rainDrop.addEventListener("animationend", () => {
      rainDrop.remove();
      rainDropCount--; // Decrease the count when a drop disappears
    });
  }
}

// Create rain drops at intervals, but stop when maxRainDrops is reached
const rainInterval = setInterval(createRainDrop, 200); // New drop every 200ms

// Optional: Clear the interval when the max drops are reached
setTimeout(() => {
  clearInterval(rainInterval);
}, maxRainDrops * 200); // Stops creating new drops after maxRainDrops

// !Flow: Client (fetch('/?city=Mumbai')) **which is in server** req.url → Node.js server → OpenWeather API → Node.js server wapas browser ko data bhej raha hai.
