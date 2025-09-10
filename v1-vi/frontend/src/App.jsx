// App.jsx
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./routes";
import ThemeProvider from './theme';
import ThemeColorPresets from './components/ThemeColorPresets';
// components
import NotistackProvider from "./components/NotistackProvider";
import { AuthProvider } from "./contexts/JWTContext";

export default function App() {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <AuthProvider>
        <ThemeColorPresets>
        <BrowserRouter>
          <NotistackProvider>
            <MainRouter />
          </NotistackProvider>
        </BrowserRouter>
        </ThemeColorPresets>
        </AuthProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}