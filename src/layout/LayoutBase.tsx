import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import CollapsibleMenu, { MenuItem } from '../components/CollapsedMenu';
import Requests from '../components/Icons/Requests';

interface ILayoutBaseProps {
  children: React.ReactNode;
  showMenu?: boolean;
}

const menuItems: MenuItem[] = [
  {
    icon: Requests,
    path: '/records',
    label: 'Registros',
  },
  {
    icon: Requests,
    path: '/equipments',
    label: 'Mapa de Equipamentos',
  },
  {
    icon: Requests,
    path: '/schedule',
    label: 'Agenda',
  },
  {
    icon: Requests,
    path: '/reports',
    label: 'Laudos',
  },
  {
    icon: Requests,
    path: '/requests-returns',
    label: 'Estastísticas',
  },
  {
    icon: Requests,
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
