const weather = require("weather-js");
const util = require("util");

const findWeather = util.promisify(weather.find);

findWeather({
  search: "Budapest, HU",
  degreeType: "C",
})
  .then((result) => {
    console.log("result", result);
  })
  .catch((error) => {
    console.error("error", error);
  });
