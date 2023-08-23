import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import Reports from '../components/Icons/Reports';
import Actions from '../components/Icons/Actions';
import FileText from '../components/Icons/fileText';
import Calendar from '../components/Icons/Calendar';
import Statistics from '../components/Icons/Statistics';
import Extinguisher from '../components/Icons/Extinguisher';
import CollapsibleMenu, { MenuItem } from '../components/CollapsedMenu';

interface ILayoutBaseProps {
  children: React.ReactNode;
  showMenu?: boolean;
}

const menuItems: MenuItem[] = [
  {
    icon: FileText,
    path: '/records',
    label: 'Registros',
  },
  {
    icon: Extinguisher,
    path: '/equipments',
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
    path: '/requests-returns',
    label: 'Estastísticas',
  },
  {
    icon: Actions,
    path: '/requests-returns',
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
