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

  const recordsItems: SubItem[] = [
    { label: 'Extintores', path: '/records/extinguisher' },
    { label: 'Hidrantes', path: '/records/hydrants' },
    { label: 'Válvulas de Governo', path: '/records/valves' },
    { label: 'Teste CMI', path: '/records/cmi_test' },
    { label: 'Inspeção CMI', path: '/records/cmi_inspection' },
  ];

  if (localSite === 'SPO') {
    recordsItems.push(
      { label: 'Portas de Emergência', path: '/records/emergency_doors' },
      { label: 'Operação OEI', path: '/records/oei_operation' },
      { label: 'Alarmes de Incêndio', path: '/records/fire_alarms' },
      { label: 'Verificação de Ambulância', path: '/records/ambulance_check' },
      { label: 'DEA', path: '/records/dea' },
    );
  }

  if (localSite === 'BXO') {
    recordsItems.push(
      { label: 'Checklist Geral', path: '/records/general_checklist' },
      { label: 'Scania', path: '/records/scania' },
      { label: 'S10', path: '/records/s10' },
      { label: 'Mercedes', path: '/records/mercedes' },
      { label: 'Furgão', path: '/records/van' },
      { label: 'Ambulância Sprinter', path: '/records/sprinter' },
      { label: 'Ambulância Iveco', path: '/records/iveco' },
    );
  }

  const equipmentsItems: SubItem[] = [
    { label: 'Extintores', path: '/equipments/extinguisher' },
    { label: 'Hidrantes', path: '/equipments/hydrants' },
    { label: 'Válvulas de Governo', path: '/equipments/valves' },
    { label: 'Teste CMI', path: '/equipments/cmi_test' },
    { label: 'Inspeção CMI', path: '/equipments/cmi_inspection' },
  ];

  if (localSite === 'SPO') {
    equipmentsItems.push(
      { label: 'Portas de Emergência', path: '/equipments/emergency_doors' },
      { label: 'Operação OEI', path: '/equipments/oei_operation' },
      { label: 'Alarmes de Incêndio', path: '/equipments/fire_alarms' },
      { label: 'Verificação de Ambulância', path: '/equipments/ambulance_check' },
      { label: 'DEA', path: '/equipments/dea' },
    );
  }

  if (localSite === 'BXO') {
    equipmentsItems.push(
      { label: 'Checklist Geral', path: '/equipments/general_checklist' },
      { label: 'Scania', path: '/equipments/scania' },
      { label: 'S10', path: '/equipments/s10' },
      { label: 'Mercedes', path: '/equipments/mercedes' },
      { label: 'Furgão', path: '/equipments/van' },
      { label: 'Ambulância Sprinter', path: '/equipments/sprinter' },
      { label: 'Ambulância Iveco', path: '/equipments/iveco' },
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
