import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Records from './pages/Records';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/records" element={<Records />} />
      <Route path="/records/:id" element={<Records />} />
    </Routes>
  );
};

export default App;
