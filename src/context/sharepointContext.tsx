import { createContext, useContext } from 'react';
import CrudSharepoint from '../services/api';

interface ISharepointContext {
  crud: CrudSharepoint;
  crudParent: CrudSharepoint;
}

const SharepointContext = createContext<ISharepointContext>({} as ISharepointContext);
export const useSharepointContext = () => useContext(SharepointContext);

export const SharepointProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const baseUrl =
    import.meta.env.VITE_ENV === 'development'
      ? import.meta.env.VITE_BASE_URL_SHAREPOINT_DEV
      : import.meta.env.VITE_BASE_URL_SHAREPOINT_PROD;

  const baseUrlParent =
    import.meta.env.VITE_ENV === 'development'
      ? import.meta.env.VITE_BASE_URL_SHAREPOINT_PARENT_DEV
      : import.meta.env.VITE_BASE_URL_SHAREPOINT_PARENT_PROD;

  const crud = new CrudSharepoint(baseUrl);
  const crudParent = new CrudSharepoint(baseUrlParent);

  return (
    <SharepointContext.Provider
      value={{
        crud,
        crudParent,
      }}
    >
      {children}
    </SharepointContext.Provider>
  );
};

export const sharepointContext = () => useContext(SharepointContext);
