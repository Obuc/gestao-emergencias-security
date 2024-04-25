import { BxoRoutes } from './routes/BxoRoutes';
import { SpoRoutes } from './routes/SpoRoutes';

const App = () => {
  const localSite = localStorage.getItem('user_site');

  if (localSite === 'BXO') return <BxoRoutes />;
  if (localSite === 'SPO') return <SpoRoutes />;
};

export default App;
