import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Records from './pages/Records';
import Equipments from './pages/Equipments';
import EquipmentsQRCode from './pages/Equipments/components/pages/EquipmentsQRCode';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/records" element={<Records />} />
      <Route path="/records/:id" element={<Records />} />

      <Route path="/equipments" element={<Equipments />} />
      <Route path="/equipments/:id" element={<Equipments />} />

      <Route path="/generateqrcodes" element={<EquipmentsQRCode />} />
    </Routes>
  );
};

export default App;
