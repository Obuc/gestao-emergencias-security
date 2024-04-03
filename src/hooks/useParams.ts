import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '../context/sharepointContext';

const useParams = () => {
  const { crud } = sharepointContext();

  const local: UseQueryResult<Array<{ Id: string; Title: string }>> = useQuery({
    queryKey: ['local'],
    queryFn: async () => {
      const resp = await crud.getListItems('local', `?$Select=Id,Title&$orderby=Title asc`);
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

  return {
    local,
    pavimento,
  };
};

export default useParams;
