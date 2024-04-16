import { Navigate, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Report from './pages/Report';
import Schedule from './pages/Schedule';
import Equipments from './pages/Equipments';
import DeaSPO from './pages/Records/Dea/SPO';
import HydrantBXO from './pages/Records/Hydrant/BXO';
import HydrantSPO from './pages/Records/Hydrant/SPO';
import TestCmiBXO from './pages/Records/TestCmi/BXO';
import TestCmiSPO from './pages/Records/TestCmi/SPO';
import LoadRatio from './pages/Records/LoadRatio/BXO';
import ExtinguisherBXO from './pages/Records/Extinguisher/BXO';
import ExtinguisherSPO from './pages/Records/Extinguisher/SPO';
import InspectionCmiBXO from './pages/Records/InspectionCmi/BXO';
import InspectionCmiSPO from './pages/Records/InspectionCmi/SPO';
import GeneralChecklist from './pages/Records/GeneralChecklist/BXO';
import GovernanceValveBXO from './pages/Records/GovernanceValve/BXO';
import GovernanceValveSPO from './pages/Records/GovernanceValve/SPO';

const App = () => {
  const localSite = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/equipments/:form" element={<Equipments />} />
      <Route path="/equipments/:form/:id" element={<Equipments />} />

      <Route path="/reports" element={<Report />} />
      <Route path="/reports/:id" element={<Report />} />

      <Route path="/schedule" element={<Schedule />} />
      <Route path="/schedule/:id" element={<Schedule />} />

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

      {/* Cmi Inspection  */}
      <Route path="/records/cmi_inspection" element={localSite === 'BXO' ? <InspectionCmiBXO /> : <InspectionCmiSPO />} />
      <Route
        path="/records/cmi_inspection/:id"
        element={localSite === 'BXO' ? <InspectionCmiBXO /> : <InspectionCmiSPO />}
      />

      {/* Cmi Test  */}
      <Route path="/records/cmi_test" element={localSite === 'BXO' ? <TestCmiBXO /> : <TestCmiSPO />} />
      <Route path="/records/cmi_test/:id" element={localSite === 'BXO' ? <TestCmiBXO /> : <TestCmiSPO />} />

      {/* LoadRatio  */}
      <Route path={`/records/:form`} element={localSite === 'BXO' && <LoadRatio />} />
      <Route path={`/records/:form/:id`} element={localSite === 'BXO' && <LoadRatio />} />

      {/* GeneralChecklist  */}
      <Route path={`/records/general_checklist`} element={localSite === 'BXO' && <GeneralChecklist />} />
      <Route path={`/records/general_checklist/:id`} element={localSite === 'BXO' && <GeneralChecklist />} />

      {/* DEA */}
      <Route path={`/records/dea`} element={localSite === 'SPO' && <DeaSPO />} />
      <Route path={`/records/dea/:id`} element={localSite === 'SPO' && <DeaSPO />} />
    </Routes>
  );
};

export default App;
