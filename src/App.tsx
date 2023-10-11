import { Navigate, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Report from './pages/Report';
import Records from './pages/Records';
import Schedule from './pages/Schedule';
import Equipments from './pages/Equipments';

const App = () => {
  const equipments_value = localStorage.getItem('equipments_value');

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/records/:form" element={<Records />} />
      <Route path="/records/:form/:id" element={<Records />} />

      <Route path="/equipments" element={<Equipments />} />
      <Route path="/equipments/:id" element={<Equipments />} />

      <Route path="/reports" element={<Report />} />
      <Route path="/reports/:id" element={<Report />} />

      <Route path="/schedule" element={<Schedule />} />

      <Route path="/records" element={<Navigate to={`/records/${equipments_value}`} />} />
    </Routes>
  );
};

export default App;
