import React from "react";
import "./App.css";
import "./assets/css/globals.css";
// import "./assets/css/react-slick.css";
// import "slick-carousel/slick/slick.css";
import { ThemeProvider } from "@mui/material";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Router from "./routes/Router";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router />
      </div>
    </ThemeProvider>
  );
}

export default App;
