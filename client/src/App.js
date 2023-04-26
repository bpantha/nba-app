import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { indigo, amber, red, blue } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Player from "./pages/Player";
import Game from "./pages/Game";
import Team from "./pages/Team";

export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player" element={<Player />} />
          <Route path="/games" element={<Game />} />
          <Route path="/teams" element={<Team />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
