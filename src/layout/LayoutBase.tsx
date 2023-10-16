import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import Reports from '../components/Icons/Reports';
import Actions from '../components/Icons/Actions';
import Calendar from '../components/Icons/Calendar';
import FileText from '../components/Icons/FileText';
import Statistics from '../components/Icons/Statistics';
import Extinguisher from '../components/Icons/Extinguisher';
import CollapsibleMenu, { MenuItem } from '../components/CollapsedMenu';

interface ILayoutBaseProps {
  children: React.ReactNode;
  showMenu?: boolean;
}

const equipments_value = localStorage.getItem('equipments_value');

const menuItems: MenuItem[] = [
  {
    icon: FileText,
    path: `/records`,
    label: 'Registros',
  },
  {
    icon: Extinguisher,
    path: `/equipments/${equipments_value ? equipments_value : 'extinguisher'}`,
    label: 'Mapa de Equipamentos',
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

const LayoutBase = ({ children, showMenu }: ILayoutBaseProps) => {
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
