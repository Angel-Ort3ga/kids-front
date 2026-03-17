import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PadreDashboard from "./pages/PadreDashboard";
import JuegoSelector from "./pages/JuegoSelector.jsx";
import JuegoAnimales from "./pages/JuegoAnimales";
import JuegoColores from "./pages/JuegoColores.jsx";
import JuegoNumeros from "./pages/JuegoNumeros.jsx";
import Register from "./pages/Register";
import Perfil from "./pages/Perfil";
import PerfilPadre from "./pages/PerfilPadre";
import Ajuste from "./pages/Ajuste";
import Splash from "./components/Splash";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard-padre" element={<PadreDashboard />} />
        <Route path="/selector" element={<JuegoSelector />} />
        <Route path="/juego/animales" element={<JuegoAnimales />} />
        <Route path="/juego/colores" element={<JuegoColores />} />
        <Route path="/juego/numeros" element={<JuegoNumeros />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/ajuste" element={<Ajuste />} />
        <Route path="/perfil-padre" element={<PerfilPadre />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
