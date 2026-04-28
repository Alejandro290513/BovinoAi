import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Resumen from './pages/Resumen';
import Animales from './pages/Animales';
import MotorIA from './pages/MotorIA';
import Costos from './components/Costos';
import AsistenteIA from './pages/AsistenteIA';
 
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Resumen />} />
          <Route path="/animales" element={<Animales />} />
          <Route path="/motor-ia" element={<MotorIA />} />
          <Route path="/costos" element={<Costos />} />
          <Route path="/asistente-ia" element={<AsistenteIA />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
 
export default App;