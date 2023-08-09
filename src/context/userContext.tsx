import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

import CrudSharepoint from '../services/api';

interface ICurrentUser {
  Email: string;
  LoginName: string;
  Title: string;
}

interface IUserContext {
  user: ICurrentUser;
}

const UserContext = createContext<IUserContext>({} as IUserContext);
export const useUserContext = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const baseUrl =
    import.meta.env.VITE_ENV === 'development'
      ? import.meta.env.VITE_BASE_URL_SHAREPOINT_DEV
      : import.meta.env.VITE_BASE_URL_SHAREPOINT_PROD;

  const crud = new CrudSharepoint(baseUrl);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return await crud.getCurrentUser();
    },
    refetchOnWindowFocus: false,
  });

  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const userContext = () => useContext(UserContext);
