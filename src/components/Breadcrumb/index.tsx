import { useLocation } from 'react-router-dom';

import { Breadcrumbs } from '@mui/material';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Breadcrumb = () => {
  const location = useLocation();
  const breadcrumbItems = location.pathname.split('/').filter((item) => item !== '');

  const breadcrumbLinks = breadcrumbItems.map((item, index) => {
    const pathSegments = breadcrumbItems.slice(0, index + 1);
    const url = `/${pathSegments.join('/')}`;
    return {
      label: item,
      url: url,
    };
  });

  return (
    <>
      <div className="w-screen h-14 px-16 py-4 flex items-center">
        <Breadcrumbs
          separator={<FontAwesomeIcon icon={faAngleRight} className="text-primary" />}
          aria-label="breadcrumb"
        >
          <span className="text-primary font-montserrat text-base">Gestão Sistema de Emergência</span>

          {breadcrumbLinks.map((item, index) => (
            <a
              className={`transition-all ease-in delay-75 px-1 text-primary font-montserrat text-base ${
                breadcrumbItems.length - 1 === index && 'font-semibold'
              }`}
              key={index}
              href={item.url}
            >
              {item.label === 'records'
                ? 'Registros'
                : item.label === 'equipments'
                ? 'Mapa de Equipamentos'
                : item.label === 'schedule'
                ? 'Agenda'
                : item.label === 'reports'
                ? 'Laudos'
                : item.label === 'new'
                ? 'Novo Laudo'
                : item.label}
            </a>
          ))}
        </Breadcrumbs>
      </div>
      <div className="shadow-xs-primary-app h-[.0625rem] -mb-[.0625rem]" />
    </>
  );
};

export default Breadcrumb;
