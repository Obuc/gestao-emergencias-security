import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';

import { ISite } from '../types/Site';
import { sharepointContext } from './sharepointContext';
import { IFormulario } from '../types/Formularios';

interface IAppContext {
  sites?: Array<ISite>;
  formularios?: Array<IFormulario>;
  isLoadingFormularios: boolean;
  isLoadingSites: boolean;
}

const AppContext = createContext<IAppContext>({} as IAppContext);
export const useSharepointContext = () => useContext(AppContext);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { crud } = sharepointContext();

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
    queryKey: ['formularios'],
    queryFn: async () => {
      const resp = await crud.getListItemsv2(
        'menu',
        '?$Select=Id,Title,site/Title,todos_sites,menu_equipamento&$expand=site',
      );
      return resp.results;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
  });

  return (
    <AppContext.Provider value={{ sites, formularios, isLoadingFormularios, isLoadingSites }}>
      {children}
    </AppContext.Provider>
  );
};

export const appContext = () => useContext(AppContext);
