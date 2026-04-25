import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Animales from './pages/Animales';
import MotorIA from './pages/MotorIA';
import Costos from './components/Costos';
 
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/animales" element={<Animales />} />
          <Route path="/motor-ia" element={<MotorIA />} />
          <Route path="/costos" element={<Costos />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;