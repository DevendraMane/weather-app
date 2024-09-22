const http = require("http");
const fs = require("fs");
const request = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");
const styleFile = fs.readFileSync("style.css", "utf-8");
const scriptFile = fs.readFileSync("script.js", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  // Convert temperature from Kelvin to Celsius
  let temperature = tempVal.replace(
    "{%tempVal%}",
    (orgVal.main.temp - 273.15).toFixed(0)
  );
  temperature = temperature.replace(
    "{%tempmin%}",
    (orgVal.main.temp_min - 273.15).toFixed(0)
  );
  temperature = temperature.replace(
    "{%tempmax%}",
    (orgVal.main.temp_max - 273.15).toFixed(0)
  );
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
  return temperature;
};

const server = http.createServer((req, res) => {
  // ?new URL();
  // ?URL() ek JavaScript ka built-in constructor hai, jo tumhare URL ko ek structured object ke form mein bana deta hai.
  // ?Jab tum isko use karte ho, toh tum us URL ke alag-alag parts ko directly access kar sakte ho, jaise protocol (http, https), host, path, aur query parameters (jo "?" ke baad hote hain).
  const url = new URL(req.url, `http://${req.headers.host}`); //?req.url +  `http://${req.headers.host}`  = http://localhost:1234/?city=city`
  // console.log(url.searchParams.get("city"));
  // console.log(req.url); //?this gives city name after searching to the url
  // console.log(`http://${req.headers.host}`); //?this gives http://localhost:1234
  // ?The searchParams read-only property of the URL interface returns a URLSearchParams object allowing access to the GET decoded query arguments contained in the URL.
  const city = url.searchParams.get("city") || "Akola"; // Default to 'Akola'

  if (req.url.startsWith("/?city=") || req.url === "/") {
    request(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2ded32c43a985fd4070907b769ac3f51`
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];

        const realTimeData = arrData
          .map((value) => replaceVal(homeFile, value))
          .join("");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else if (req.url === "/style.css") {
    res.writeHead(200, { "Content-Type": "text/css" });
    res.write(styleFile);
    res.end();
  } else if (req.url === "/script.js") {
    res.writeHead(200, { "Content-Type": "text/js" });
    res.write(scriptFile);
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("File not found");
  }
});

server.listen(1234, "127.0.0.1", () => {
  console.log("server on port 1234");
});
