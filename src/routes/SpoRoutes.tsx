import { Route, Routes } from 'react-router-dom';

import Home from '../pages/Home';
import Report from '../pages/Report';
import Schedule from '../pages/Schedule';
import OeiSPO from '../pages/Records/Oei/SPO';
import DeaSPO from '../pages/Records/Dea/SPO';
import AlarmsSPO from '../pages/Records/Alarms/SPO';
import HydrantSPO from '../pages/Records/Hydrant/SPO';
import TestCmiSPO from '../pages/Records/TestCmi/SPO';
import EquipmentsOeiSPO from '../pages/Equipments/Oei/SPO';
import EquipmentsValveSPO from '../pages/Equipments/Valve/SPO';
import ExtinguisherSPO from '../pages/Records/Extinguisher/SPO';
import InspectionCmiSPO from '../pages/Records/InspectionCmi/SPO';
import EmergencyDoorSPO from '../pages/Records/EmergencyDoor/SPO';
import EquipmentsCmiTestSPO from '../pages/Equipments/CmiTest/SPO';
import EquipmentsHydrantSPO from '../pages/Equipments/Hydrants/SPO';
import AmbulanceCheckSPO from '../pages/Records/AmbulanceCheck/SPO';
import GovernanceValveSPO from '../pages/Records/GovernanceValve/SPO';
import EquipmentsFireAlarmsSPO from '../pages/Equipments/FireAlarms/SPO';
import EquipmentsExtinguisherSPO from '../pages/Equipments/Extinguisher/SPO';
import EquipmentsCmiInspectionSPO from '../pages/Equipments/CmiInspection/SPO';
import EquipmentsEmergencyDoorsSPO from '../pages/Equipments/EmergencyDoors/SPO';
import EquipmentsAmbulanceCheckSPO from '../pages/Equipments/AmbulanceCheck/SPO';

export const SpoRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reports" element={<Report />} />
      <Route path="/reports/:id" element={<Report />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/schedule/:id" element={<Schedule />} />

      {/* Extinguisher  */}
      <Route path="/records/extinguisher" element={<ExtinguisherSPO />} />
      <Route path="/records/extinguisher/:id" element={<ExtinguisherSPO />} />

      {/* Hydrant  */}
      <Route path="/records/hydrant" element={<HydrantSPO />} />
      <Route path="/records/hydrant/:id" element={<HydrantSPO />} />

      {/* Valves  */}
      <Route path="/records/valve" element={<GovernanceValveSPO />} />
      <Route path="/records/valve/:id" element={<GovernanceValveSPO />} />

      {/* Cmi Inspection  */}
      <Route path="/records/cmi_inspection" element={<InspectionCmiSPO />} />
      <Route path="/records/cmi_inspection/:id" element={<InspectionCmiSPO />} />

      {/* Cmi Test  */}
      <Route path="/records/cmi_test" element={<TestCmiSPO />} />
      <Route path="/records/cmi_test/:id" element={<TestCmiSPO />} />

      {/* DEA */}
      <Route path={`/records/dea`} element={<DeaSPO />} />
      <Route path={`/records/dea/:id`} element={<DeaSPO />} />

      {/* Alarms */}
      <Route path={`/records/fire_alarms`} element={<AlarmsSPO />} />
      <Route path={`/records/fire_alarms/:id`} element={<AlarmsSPO />} />

      {/* OEI */}
      <Route path={`/records/oei_operation`} element={<OeiSPO />} />
      <Route path={`/records/oei_operation/:id`} element={<OeiSPO />} />

      {/* Emergency Door */}
      <Route path={`/records/emergency_doors`} element={<EmergencyDoorSPO />} />
      <Route path={`/records/emergency_doors/:id`} element={<EmergencyDoorSPO />} />

      {/* Ambulance Check */}
      <Route path={`/records/ambulance_check`} element={<AmbulanceCheckSPO />} />
      <Route path={`/records/ambulance_check/:id`} element={<AmbulanceCheckSPO />} />

      {/* Equipments - Extinguisher */}
      <Route path="/equipments/extinguisher" element={<EquipmentsExtinguisherSPO />} />
      <Route path="/equipments/extinguisher/:id" element={<EquipmentsExtinguisherSPO />} />

      {/* Equipments - Hydrant */}
      <Route path="/equipments/hydrant" element={<EquipmentsHydrantSPO />} />
      <Route path="/equipments/hydrant/:id" element={<EquipmentsHydrantSPO />} />

      {/* Equipments - Valve */}
      <Route path="/equipments/valve" element={<EquipmentsValveSPO />} />
      <Route path="/equipments/valve/:id" element={<EquipmentsValveSPO />} />

      {/* Equipments - Cmi Test */}
      <Route path="/equipments/cmi_test" element={<EquipmentsCmiTestSPO />} />
      <Route path="/equipments/cmi_test/:id" element={<EquipmentsCmiTestSPO />} />

      {/* Equipments - Cmi Inspection */}
      <Route path="/equipments/cmi_inspection" element={<EquipmentsCmiInspectionSPO />} />
      <Route path="/equipments/cmi_inspection/:id" element={<EquipmentsCmiInspectionSPO />} />

      {/* Equipments - Emergency Doors */}
      <Route path="/equipments/emergency_doors" element={<EquipmentsEmergencyDoorsSPO />} />
      <Route path="/equipments/emergency_doors/:id" element={<EquipmentsEmergencyDoorsSPO />} />

      {/* Equipments - OEI Operations */}
      <Route path="/equipments/oei_operation" element={<EquipmentsOeiSPO />} />
      <Route path="/equipments/oei_operation/:id" element={<EquipmentsOeiSPO />} />

      {/* Equipments - Fire Alarms */}
      <Route path="/equipments/fire_alarms" element={<EquipmentsFireAlarmsSPO />} />
      <Route path="/equipments/fire_alarms/:id" element={<EquipmentsFireAlarmsSPO />} />

      {/* Equipments - Ambulance Check */}
      <Route path="/equipments/ambulance_check" element={<EquipmentsAmbulanceCheckSPO />} />
      <Route path="/equipments/ambulance_check/:id" element={<EquipmentsAmbulanceCheckSPO />} />
    </Routes>
  );
};
