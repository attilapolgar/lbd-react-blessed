import useInterval from "@use-it/interval";
import figlet from "figlet";
import React from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import util from "util";
import weather from "weather-js";
import chalk from "chalk";
import gradient from "gradient-string";
import Box from "./Box";

const findWeather = util.promisify(weather.find);

const FONTS = [
  "Straight",
  "ANSI Shadow",
  "Shimrod",
  "doom",
  "Big",
  "Ogre",
  "Small",
  "Standard",
  "Bigfig",
  "Mini",
  "Small Script",
  "Small Shadow",
];

const useRequest = (promise, options, interval) => {
  const [state, setState] = React.useState({
    status: "loading",
    error: null,
    data: null,
  });

  const request = React.useCallback(
    async (options) => {
      setState({ data: null, error: null, status: "loading" });
      let data;

      try {
        data = await promise(options);
        setState({ data, error: null, status: "complete" });
      } catch (error) {
        setState({ data: null, error, status: "error" });
      }
    },
    [promise]
  );

  useDeepCompareEffect(() => {
    request(options);
  }, [options, request]);

  useInterval(() => {
    request(options);
  }, interval);

  return state;
};

const formatWeather = ([results]) => {
  const { location, current, forecast } = results;
  const degreeType = location.degreetype;
  const temperature = `${current.temperature}°${degreeType}`;
  const conditions = current.skytext;
  const low = `${forecast[1].low}°${degreeType}`;
  const high = `${forecast[1].high}°${degreeType}`;

  return `${chalk.yellow(temperature)} and ${chalk.green(
    conditions
  )} (${chalk.blue(low)} -> ${chalk.red(high)})`;
};

export default function Today({
  updateInterval = 900000,
  search = "Budapest, HU",
  degreeType = "C",
  top,
  left,
  width,
  height,
}) {
  const boxProps = { top, left, width, height };

  const [now, setNow] = React.useState(new Date());

  const weather = useRequest(
    findWeather,
    { search, degreeType },
    updateInterval
  );

  useInterval(() => {
    setNow(new Date());
  }, 1000);

  const date = now.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const time = figlet.textSync(
    now.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    {
      font: FONTS[0],
    }
  );

  return (
    <Box label="Today" {...boxProps}>
      <text right={1}>{chalk.blue(date)}</text>
      <text top="center" left="center">
        {gradient.atlas.multiline(time)}
      </text>
      <text top="100%-3" left={1}>
        {weather.status === "loading"
          ? "Loading"
          : weather.error
          ? `Error: $
        {weather.error}`
          : formatWeather(weather.data)}
      </text>
    </Box>
  );
}
