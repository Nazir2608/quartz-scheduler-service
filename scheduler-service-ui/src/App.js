import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import History from "./pages/History";

import { lightTheme, darkTheme } from "./theme";

const App = () => {
  const [mode, setMode] = useState("light");
  const toggleTheme = () =>
    setMode(mode === "light" ? "dark" : "light");

  return (
    <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar mode={mode} toggleTheme={toggleTheme} />
        <Sidebar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddJob />} />
          <Route path="/edit/:id" element={<EditJob />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
