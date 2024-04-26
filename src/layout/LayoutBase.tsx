import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import Reports from '../components/Icons/Reports';
import Actions from '../components/Icons/Actions';
import Calendar from '../components/Icons/Calendar';
import FileText from '../components/Icons/FileText';
import Statistics from '../components/Icons/Statistics';
import Extinguisher from '../components/Icons/Extinguisher';
import CollapsibleMenu, { MenuItem, SubItem } from '../components/CollapsedMenu';

interface ILayoutBaseProps {
  children: React.ReactNode;
  showMenu?: boolean;
}

const LayoutBase = ({ children, showMenu }: ILayoutBaseProps) => {
  const localSite = localStorage.getItem('user_site');

  const localSiteLowerCase = localSite?.toLowerCase();

  const recordsItems: SubItem[] = [
    { label: 'Extintores', path: `/${localSiteLowerCase}/records/extinguisher` },
    { label: 'Hidrantes', path: `/${localSiteLowerCase}/records/hydrant` },
    { label: 'Válvulas de Governo', path: `/${localSiteLowerCase}/records/valve` },
    { label: 'Teste CMI', path: `/${localSiteLowerCase}/records/cmi_test` },
    { label: 'Inspeção CMI', path: `/${localSiteLowerCase}/records/cmi_inspection` },
  ];

  if (localSite === 'SPO') {
    recordsItems.push(
      { label: 'Portas de Emergência', path: '/spo/records/emergency_doors' },
      { label: 'Operação OEI', path: '/spo/records/oei_operation' },
      { label: 'Alarmes de Incêndio', path: '/spo/records/fire_alarms' },
      { label: 'Verificação de Ambulância', path: '/spo/records/ambulance_check' },
      { label: 'DEA', path: '/spo/records/dea' },
    );
  }

  if (localSite === 'BXO') {
    recordsItems.push(
      { label: 'Checklist Geral', path: '/bxo/records/general_checklist' },
      { label: 'Scania', path: '/bxo/records/scania' },
      { label: 'S10', path: '/bxo/records/s10' },
      { label: 'Mercedes', path: '/bxo/records/mercedes' },
      { label: 'Furgão', path: '/bxo/records/van' },
      { label: 'Ambulância Sprinter', path: '/bxo/records/sprinter' },
      { label: 'Ambulância Iveco', path: '/bxo/records/iveco' },
    );
  }

  const equipmentsItems: SubItem[] = [
    { label: 'Extintores', path: `/${localSiteLowerCase}/equipments/extinguisher` },
    { label: 'Hidrantes', path: `/${localSiteLowerCase}/equipments/hydrant` },
    { label: 'Válvulas de Governo', path: `/${localSiteLowerCase}/equipments/valve` },
    { label: 'Teste CMI', path: `/${localSiteLowerCase}/equipments/cmi_test` },
    { label: 'Inspeção CMI', path: `/${localSiteLowerCase}/equipments/cmi_inspection` },
  ];

  if (localSite === 'SPO') {
    equipmentsItems.push(
      { label: 'Portas de Emergência', path: '/spo/equipments/emergency_doors' },
      { label: 'Operação OEI', path: '/spo/equipments/oei_operation' },
      { label: 'Alarmes de Incêndio', path: '/spo/equipments/fire_alarms' },
      { label: 'Verificação de Ambulância', path: '/spo/equipments/ambulance_check' },
      { label: 'DEA', path: '/spo/equipments/dea' },
    );
  }

  if (localSite === 'BXO') {
    equipmentsItems.push(
      { label: 'Checklist Geral', path: '/bxo/equipments/general_checklist' },
      { label: 'Scania', path: '/bxo/equipments/scania' },
      { label: 'S10', path: '/bxo/equipments/s10' },
      { label: 'Mercedes', path: '/bxo/equipments/mercedes' },
      { label: 'Furgão', path: '/bxo/equipments/van' },
      { label: 'Ambulância Sprinter', path: '/bxo/equipments/sprinter' },
      { label: 'Ambulância Iveco', path: '/bxo/equipments/iveco' },
    );
  }

  const menuItems: MenuItem[] = [
    {
      icon: FileText,
      label: 'Registros',
      subitems: recordsItems,
    },
    {
      icon: Extinguisher,
      label: 'Mapa de Equipamentos',
      subitems: equipmentsItems,
    },
    {
      icon: Calendar,
      path: '/schedule',
      label: 'Agenda',
    },
    {
      icon: Reports,
      path: '/reports',
      label: 'Laudos',
    },
    {
      icon: Statistics,
      path: 'https://app.powerbi.com/groups/me/apps/67ad2565-370a-44b3-8c39-bb9496f3d5a7/reports/7c8808bf-83a8-4b72-854c-66ca77422b65/ReportSection92e9e4850ebd49723e0e?ctid=fcb2b37b-5da0-466b-9b83-0014b67a7c78',
      label: 'Estastísticas',
    },
    {
      icon: Actions,
      path: 'https://bayergroup.sharepoint.com/sites/005070/system/plano_de_acao.html',
      label: 'Ações',
    },
  ];

  return (
    <div className="h-screen max-h-screen flex flex-col">
      <Header />
      <Breadcrumb />
      <div className="flex h-full max-h-screen overflow-hidden">
        {showMenu && <CollapsibleMenu items={menuItems} />}

        {children}
      </div>
    </div>
  );
};

export default LayoutBase;
