import { Breadcrumbs } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
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

  const labelMappings: any = {
    records: 'Registros',
    equipments: 'Mapa de Equipamentos',
    schedule: 'Agenda',
    reports: 'Laudos',
    new: 'Novo Laudo',
    extinguisher: 'Extintores',
    hydrant: 'Hidrantes',
    valve: 'Válvulas de Governo',
    cmi_test: 'Teste CMI',
    cmi_inspection: 'Inspeção CMI',
    general_checklist: 'Checklist Geral',
    scania: 'Scania',
    s10: 'S10',
    mercedes: 'Mercedes',
    van: 'Furgão',
    sprinter: 'Ambulância Sprinter',
    iveco: 'Ambulância Iveco',

    emergency_doors: 'Portas de Emergência',
    oei_operation: 'Operação OEI',
    fire_alarms: 'Alarmes de Incêndio',
    ambulance_check: 'Verificação de Ambulância',
    dea: 'DEA',

    spo: 'São Paulo',
    bxo: 'Belford Roxo',
  };

  return (
    <>
      <div className="w-screen h-14 px-16 py-4 flex items-center">
        <Breadcrumbs
          separator={<FontAwesomeIcon icon={faAngleRight} className="text-primary-font" />}
          aria-label="breadcrumb"
        >
          <span className="text-primary-font font-montserrat text-base">Gestão Sistema de Emergência</span>

          {breadcrumbLinks.map((item, index) => (
            <Link
              className={`transition-all ease-in delay-75 px-1 text-primary-font font-montserrat text-base ${
                breadcrumbItems.length - 1 === index && 'font-semibold'
              }`}
              key={index}
              to={item.url}
            >
              {labelMappings[item.label] || item.label}
            </Link>
          ))}
        </Breadcrumbs>
      </div>
      <div className="shadow-xs-primary-app h-[.0625rem] -mb-[.0625rem]" />
    </>
  );
};

export default Breadcrumb;
