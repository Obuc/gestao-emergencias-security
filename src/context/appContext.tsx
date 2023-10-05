import { createContext, useContext } from 'react';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { ISite } from '../types/Site';
import { ISubMenu } from '../types/SubMenu';
import { IFormulario } from '../types/Formularios';
import { sharepointContext } from './sharepointContext';

interface IAppContext {
  sites?: Array<ISite>;
  formularios?: Array<IFormulario>;
  submenu?: Array<ISubMenu>;
  local?: Array<ILocal>;
  isLoadingFormularios: boolean;
  isLoadingSites: boolean;
}

const AppContext = createContext<IAppContext>({} as IAppContext);
export const useSharepointContext = () => useContext(AppContext);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { crud } = sharepointContext();
  const localSite = localStorage.getItem('user_site');

  const { data: sites, isLoading: isLoadingSites }: UseQueryResult<Array<ISite>> = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const resp = await crud.getListItemsv2('site', '?$Select=Id,Title');
      return resp.results;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
  });

  const { data: formularios, isLoading: isLoadingFormularios }: UseQueryResult<Array<IFormulario>> = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const resp = await crud.getListItemsv2(
        'menu',
        '?$Select=Id,Title,site/Title,todos_sites,submenu,menu_equipamento&$expand=site',
      );
      return resp.results;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
  });

  const { data: submenu }: UseQueryResult<Array<ISubMenu>> = useQuery({
    queryKey: ['submenu'],
    queryFn: async () => {
      const resp = await crud.getListItemsv2(
        'submenu',
        '?$Select=Id,Title,site/Title,todos_sites,menu_idId&$expand=site',
      );
      return resp.results;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
  });

  const { data: local }: UseQueryResult<Array<ILocal>> = useQuery({
    queryKey: localSite ? ['local', localSite] : ['local'],
    queryFn: async () => {
      if (localSite) {
        const resp = await crud.getListItems(
          'local',
          `?$Select=Id,Title,site/Title&$expand=site&$Filter=( site/Title eq '${localSite}')`,
        );
        return resp;
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: !!localSite,
  });

  return (
    <AppContext.Provider value={{ sites, formularios, submenu, local, isLoadingFormularios, isLoadingSites }}>
      {children}
    </AppContext.Provider>
  );
};

export const appContext = () => useContext(AppContext);
