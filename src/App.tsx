import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import { BxoRoutes } from './routes/BxoRoutes';
import { SpoRoutes } from './routes/SpoRoutes';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/bxo/*" element={<BxoRoutes />} />
      <Route path="/spo/*" element={<SpoRoutes />} />
    </Routes>
  );
};

export default App;
