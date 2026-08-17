// src/App.tsx — full replace
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import GameProvider from "./context/GameContext";
import { ToastProvider } from "./components/ui/Toast";

import Home from "./pages/Home";
import Games from "./pages/Games";
import Game from "./pages/Game";
import AddGame from "./pages/AddGame";
import Player from "./pages/Player";
import Analysis from "./pages/Analysis";
import About from "./pages/About";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <GameProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/add" element={<AddGame />} />
              <Route path="/games/edit/:gameId" element={<AddGame />} />
              <Route path="/games/:gameId" element={<Game />} />
              <Route path="/players/:playerId" element={<Player />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </GameProvider>
  );
}

export default App;