import { createContext, useContext } from 'react';
import CrudSharepoint from '../services/api';

interface ISharepointContext {
  crud: CrudSharepoint;
}

const SharepointContext = createContext<ISharepointContext>({} as ISharepointContext);
export const useSharepointContext = () => useContext(SharepointContext);

export const SharepointProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const baseUrl = 'https://bayergroup.sharepoint.com/sites/005070';
  const baseUrl = 'http://localhost:8080';
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

export const useVariables = () => useContext(SharepointContext);
