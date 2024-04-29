import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { ISite } from '@/types/Site';
import { sharepointContext } from '@/context/sharepointContext';

export const useHome = () => {
  const { crud } = sharepointContext();

  const sites: UseQueryResult<Array<ISite>> = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const resp = await crud.getListItemsv2('site', '?$Select=Id,Title');
      return resp.results;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
  });

  return {
    sites,
  };
};
