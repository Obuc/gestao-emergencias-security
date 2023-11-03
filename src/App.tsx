import { Navigate, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Report from './pages/Report';
import Records from './pages/Records';
import Schedule from './pages/Schedule';
import Equipments from './pages/Equipments';

const App = () => {
  const site = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  return (
    <Routes>
      <Route path="/" element={!site ? <Home /> : <Navigate to={`/records/${equipments_value}`} />} />

      <Route path="/records/:form" element={<Records />} />
      <Route path="/records/:form/:id" element={<Records />} />

      <Route path="/equipments/:form" element={<Equipments />} />
      <Route path="/equipments/:form/:id" element={<Equipments />} />

      <Route path="/reports" element={<Report />} />
      <Route path="/reports/:id" element={<Report />} />

      <Route path="/schedule" element={<Schedule />} />
      <Route path="/schedule/:id" element={<Schedule />} />

      <Route path="/records" element={<Navigate to={`/records/${equipments_value}`} />} />
      <Route path="/equipments" element={<Navigate to={`/equipments/${equipments_value}`} />} />
    </Routes>
  );
};

export default App;
