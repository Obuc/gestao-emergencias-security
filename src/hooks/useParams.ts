import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { ITipoVeiculo } from '../types/TipoVeiculo';
import { sharepointContext } from '../context/sharepointContext';

const useParams = () => {
  const { crud } = sharepointContext();
  const localSite = localStorage.getItem('user_site');

  const local: UseQueryResult<Array<{ Id: string; Title: string }>> = useQuery({
    queryKey: ['local'],
    queryFn: async () => {
      const resp = await crud.getListItems(
        'local',
        `?$Select=Id,Title,site/Title&$orderby=Title asc&$Expand=site&$Filter=(site/Title eq 'BXO')`,
      );
      return resp;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
  });

  const pavimento: UseQueryResult<Array<{ Id: string; Title: string }>> = useQuery({
    queryKey: ['pavimento'],
    queryFn: async () => {
      const resp = await crud.getListItems('pavimento', `?$Select=Id,Title&$orderby=Title asc`);
      return resp;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
  });

  const predio: UseQueryResult<Array<{ Id: string; Title: string }>> = useQuery({
    queryKey: ['predio'],
    queryFn: async () => {
      const resp = await crud.getListItems(
        'predio',
        `?$Select=Id,Title,site/Title&$Expand=site&$orderby=Title asc&$Filter=(site/Title eq 'BXO')`,
      );
      return resp;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
  });

  const tipo_extintor: UseQueryResult<Array<{ Id: string; Title: string }>> = useQuery({
    queryKey: ['tipo_extintor'],
    queryFn: async () => {
      const resp = await crud.getListItems('tipo_extintor', `?$Select=Id,Title&$orderby=Title asc`);
      return resp;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
  });

  const tipo_veiculo: UseQueryResult<Array<ITipoVeiculo>> = useQuery({
    queryKey: ['tipo_veiculo', localSite],
    queryFn: async () => {
      if (localSite) {
        const resp = await crud.getListItems(
          'tipo_veiculo',
          `?$Select=Id,Title,site/Title&$expand=site&$orderby=Title asc&$Filter=(site/Title eq '${localSite}')`,
        );
        return resp;
      } else {
        return [];
      }
    },
    staleTime: Infinity, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: !!localSite,
  });

  return {
    local,
    pavimento,
    predio,
    tipo_extintor,
    tipo_veiculo,
  };
};

export default useParams;
