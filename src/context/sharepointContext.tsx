import { createContext, useContext } from 'react';
import CrudSharepoint from '../services/api';

interface ISharepointContext {
  crud: CrudSharepoint;
}

const SharepointContext = createContext<ISharepointContext>({} as ISharepointContext);
export const useSharepointContext = () => useContext(SharepointContext);

export const SharepointProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const baseUrl =
    import.meta.env.VITE_ENV === 'development'
      ? import.meta.env.VITE_BASE_URL_SHAREPOINT_DEV
      : import.meta.env.VITE_BASE_URL_SHAREPOINT_PROD;

  const crud = new CrudSharepoint(baseUrl);

  return (
    <SharepointContext.Provider
      value={{
        crud,
      }}
    >
      {children}
    </SharepointContext.Provider>
  );
};

export const sharepointContext = () => useContext(SharepointContext);
