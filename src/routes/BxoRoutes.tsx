import { Route, Routes } from 'react-router-dom';

import Home from '../pages/Home';
import Report from '../pages/Report';
import Schedule from '../pages/Schedule';
import Equipments from '../pages/Equipments';
import TestCmiBXO from '../pages/Records/TestCmi/BXO';
import HydrantBXO from '../pages/Records/Hydrant/BXO';
import LoadRatio from '../pages/Records/LoadRatio/BXO';
import EquipmentsValveBXO from '../pages/Equipments/Valve/BXO';
import ExtinguisherBXO from '../pages/Records/Extinguisher/BXO';
import InspectionCmiBXO from '../pages/Records/InspectionCmi/BXO';
import EquipmentsHydrantBXO from '../pages/Equipments/Hydrants/BXO';
import GeneralChecklist from '../pages/Records/GeneralChecklist/BXO';
import GovernanceValveBXO from '../pages/Records/GovernanceValve/BXO';
import EquipmentsExtinguisherBXO from '../pages/Equipments/Extinguisher/BXO';

export const BxoRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/reports" element={<Report />} />
      <Route path="/reports/:id" element={<Report />} />

      <Route path="/schedule" element={<Schedule />} />
      <Route path="/schedule/:id" element={<Schedule />} />

      {/* Extinguisher  */}
      <Route path="/records/extinguisher" element={<ExtinguisherBXO />} />
      <Route path="/records/extinguisher/:id" element={<ExtinguisherBXO />} />

      {/* Hydrant  */}
      <Route path="/records/hydrant" element={<HydrantBXO />} />
      <Route path="/records/hydrant/:id" element={<HydrantBXO />} />

      {/* Valves  */}
      <Route path="/records/valve" element={<GovernanceValveBXO />} />
      <Route path="/records/valve/:id" element={<GovernanceValveBXO />} />

      {/* Cmi Inspection  */}
      <Route path="/records/cmi_inspection" element={<InspectionCmiBXO />} />
      <Route path="/records/cmi_inspection/:id" element={<InspectionCmiBXO />} />

      {/* Cmi Test  */}
      <Route path="/records/cmi_test" element={<TestCmiBXO />} />
      <Route path="/records/cmi_test/:id" element={<TestCmiBXO />} />

      {/* LoadRatio  */}
      <Route path={`/records/:form`} element={<LoadRatio />} />
      <Route path={`/records/:form/:id`} element={<LoadRatio />} />

      {/* GeneralChecklist  */}
      <Route path={`/records/general_checklist`} element={<GeneralChecklist />} />
      <Route path={`/records/general_checklist/:id`} element={<GeneralChecklist />} />

      {/* Equipments */}
      <Route path="/equipments/:form" element={<Equipments />} />
      <Route path="/equipments/:form/:id" element={<Equipments />} />

      {/* Equipments - Extinguisher */}
      <Route path="/equipments/extinguisher" element={<EquipmentsExtinguisherBXO />} />
      <Route path="/equipments/extinguisher/:id" element={<EquipmentsExtinguisherBXO />} />

      {/* Equipments - Hydrant */}
      <Route path="/equipments/hydrant" element={<EquipmentsHydrantBXO />} />
      <Route path="/equipments/hydrant/:id" element={<EquipmentsHydrantBXO />} />

      {/* Equipments - Valve */}
      <Route path="/equipments/valve" element={<EquipmentsValveBXO />} />
      <Route path="/equipments/valve/:id" element={<EquipmentsValveBXO />} />
    </Routes>
  );
};
