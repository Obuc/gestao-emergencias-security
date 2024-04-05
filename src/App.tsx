import { Navigate, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Report from './pages/Report';
import Records from './pages/Records';
import Schedule from './pages/Schedule';
import Equipments from './pages/Equipments';
import ExtinguisherBXO from './pages/Records/Extinguisher/BXO';
import ExtinguisherSPO from './pages/Records/Extinguisher/SPO';
import HydrantBXO from './pages/Records/Hydrant/BXO';
import HydrantSPO from './pages/Records/Hydrant/SPO';
import GovernanceValveBXO from './pages/Records/GovernanceValve/BXO';
import GovernanceValveSPO from './pages/Records/GovernanceValve/SPO';

const App = () => {
  const equipments_value = localStorage.getItem('equipments_value');

  const localSite = localStorage.getItem('user_site');

  return (
    <Routes>
      <Route path="/" element={<Home />} />

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

      {/* Extinguisher  */}
      <Route path="/records/extinguisher" element={localSite === 'BXO' ? <ExtinguisherBXO /> : <ExtinguisherSPO />} />
      <Route path="/records/extinguisher/:id" element={localSite === 'BXO' ? <ExtinguisherBXO /> : <ExtinguisherSPO />} />

      {/* Hydrant  */}
      <Route path="/records/hydrants" element={localSite === 'BXO' ? <HydrantBXO /> : <HydrantSPO />} />
      <Route path="/records/hydrants/:id" element={localSite === 'BXO' ? <HydrantBXO /> : <HydrantSPO />} />

      {/* Valves  */}
      <Route path="/records/valves" element={localSite === 'BXO' ? <GovernanceValveBXO /> : <GovernanceValveSPO />} />
      <Route path="/records/valves/:id" element={localSite === 'BXO' ? <GovernanceValveBXO /> : <GovernanceValveSPO />} />
    </Routes>
  );
};

export default App;
