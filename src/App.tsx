import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Report from './pages/Report';
import Schedule from './pages/Schedule';
import DeaSPO from './pages/Records/Dea/SPO';
import OeiSPO from './pages/Records/Oei/SPO';
import AlarmsSPO from './pages/Records/Alarms/SPO';
import HydrantBXO from './pages/Records/Hydrant/BXO';
import HydrantSPO from './pages/Records/Hydrant/SPO';
import TestCmiBXO from './pages/Records/TestCmi/BXO';
import TestCmiSPO from './pages/Records/TestCmi/SPO';
import LoadRatio from './pages/Records/LoadRatio/BXO';
import EquipmentsValveSPO from './pages/Equipments/Valve/SPO';
import ExtinguisherBXO from './pages/Records/Extinguisher/BXO';
import ExtinguisherSPO from './pages/Records/Extinguisher/SPO';
import InspectionCmiBXO from './pages/Records/InspectionCmi/BXO';
import InspectionCmiSPO from './pages/Records/InspectionCmi/SPO';
import EmergencyDoorSPO from './pages/Records/EmergencyDoor/SPO';
import EquipmentsCmiTestSPO from './pages/Equipments/CmiTest/SPO';
import AmbulanceCheckSPO from './pages/Records/AmbulanceCheck/SPO';
import EquipmentsHydrantSPO from './pages/Equipments/Hydrants/SPO';
import GeneralChecklist from './pages/Records/GeneralChecklist/BXO';
import GovernanceValveBXO from './pages/Records/GovernanceValve/BXO';
import GovernanceValveSPO from './pages/Records/GovernanceValve/SPO';
import EquipmentsExtinguisherBXO from './pages/Equipments/Extinguisher/BXO';
import EquipmentsExtinguisherSPO from './pages/Equipments/Extinguisher/SPO';
import EquipmentsCmiInspectionSPO from './pages/Equipments/CmiInspection/SPO';

const App = () => {
  const localSite = localStorage.getItem('user_site');

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reports" element={<Report />} />
      <Route path="/reports/:id" element={<Report />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/schedule/:id" element={<Schedule />} />
      {/* Extinguisher  */}
      <Route path="/records/extinguisher" element={localSite === 'BXO' ? <ExtinguisherBXO /> : <ExtinguisherSPO />} />
      <Route path="/records/extinguisher/:id" element={localSite === 'BXO' ? <ExtinguisherBXO /> : <ExtinguisherSPO />} />
      {/* Hydrant  */}
      <Route path="/records/hydrants" element={localSite === 'BXO' ? <HydrantBXO /> : <HydrantSPO />} />
      <Route path="/records/hydrants/:id" element={localSite === 'BXO' ? <HydrantBXO /> : <HydrantSPO />} />
      {/* Valves  */}
      <Route path="/records/valve" element={localSite === 'BXO' ? <GovernanceValveBXO /> : <GovernanceValveSPO />} />
      <Route path="/records/valve/:id" element={localSite === 'BXO' ? <GovernanceValveBXO /> : <GovernanceValveSPO />} />
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
      {/* Alarms */}
      <Route path={`/records/fire_alarms`} element={localSite === 'SPO' && <AlarmsSPO />} />
      <Route path={`/records/fire_alarms/:id`} element={localSite === 'SPO' && <AlarmsSPO />} />
      {/* OEI */}
      <Route path={`/records/oei_operation`} element={localSite === 'SPO' && <OeiSPO />} />
      <Route path={`/records/oei_operation/:id`} element={localSite === 'SPO' && <OeiSPO />} />
      {/* Emergency Door */}
      <Route path={`/records/emergency_doors`} element={localSite === 'SPO' && <EmergencyDoorSPO />} />
      <Route path={`/records/emergency_doors/:id`} element={localSite === 'SPO' && <EmergencyDoorSPO />} />
      {/* Ambulance Check */}
      <Route path={`/records/ambulance_check`} element={localSite === 'SPO' && <AmbulanceCheckSPO />} />
      <Route path={`/records/ambulance_check/:id`} element={localSite === 'SPO' && <AmbulanceCheckSPO />} />
      {/* Equipments - Extinguisher */}
      <Route
        path="/equipments/extinguisher"
        element={localSite === 'BXO' ? <EquipmentsExtinguisherBXO /> : <EquipmentsExtinguisherSPO />}
      />
      <Route
        path="/equipments/extinguisher/:id"
        element={localSite === 'BXO' ? <EquipmentsExtinguisherBXO /> : <EquipmentsExtinguisherSPO />}
      />
      {/* Equipments - Hydrant */}
      <Route
        path="/equipments/hydrant"
        element={localSite === 'BXO' ? <EquipmentsExtinguisherBXO /> : <EquipmentsHydrantSPO />}
      />
      <Route
        path="/equipments/hydrant/:id"
        element={localSite === 'BXO' ? <EquipmentsExtinguisherBXO /> : <EquipmentsHydrantSPO />}
      />
      {/* Equipments - Valve */}
      <Route
        path="/equipments/valve"
        element={localSite === 'BXO' ? <EquipmentsExtinguisherBXO /> : <EquipmentsValveSPO />}
      />
      <Route
        path="/equipments/valve/:id"
        element={localSite === 'BXO' ? <EquipmentsExtinguisherBXO /> : <EquipmentsValveSPO />}
      />
      {/* Equipments - Cmi Test */}
      <Route
        path="/equipments/cmi_test"
        element={localSite === 'BXO' ? <EquipmentsExtinguisherBXO /> : <EquipmentsCmiTestSPO />}
      />
      <Route
        path="/equipments/cmi_test/:id"
        element={localSite === 'BXO' ? <EquipmentsExtinguisherBXO /> : <EquipmentsCmiTestSPO />}
      />
      {/* Equipments - Cmi Inspection */}
      <Route
        path="/equipments/cmi_inspection"
        element={localSite === 'BXO' ? <EquipmentsExtinguisherBXO /> : <EquipmentsCmiInspectionSPO />}
      />
      <Route
        path="/equipments/cmi_inspection/:id"
        element={localSite === 'BXO' ? <EquipmentsExtinguisherBXO /> : <EquipmentsCmiInspectionSPO />}
      />
    </Routes>
  );
};

export default App;
