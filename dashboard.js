import React from "react";
import blessed from "blessed";
import { render } from "react-blessed";

import Today from "./components/Today";
import Box from "./components/Box";

const App = () => {
  return (
    <>
      <Today
        updateInterval={900000}
        top={0}
        left={0}
        width="50%"
        height="35%"
      />
      <Box label="Recent Commits" top={0} left="50%" width="50%" height="50%" />
      <Box label="Time Log" top="35%" left={0} width="25%" height="65%" />
      <Box label="Pomodoro" top="35%" left="25%" width="25%" height="65%" />
      <Box label="GitHub" top="50%" left="50%" width="50%" height="50%" />
    </>
  );
};

const screen = blessed.screen({
  sutoPadding: true,
  smartCSR: true,
  title: "Develop Dashboard",
});

screen.key(["escape", "q", "C-c"], () => process.exit());

render(<App />, screen);
