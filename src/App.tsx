import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import { SpoRoutes } from './routes/SpoRoutes';
import { BxoRoutes } from './routes/BxoRoutes';

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
