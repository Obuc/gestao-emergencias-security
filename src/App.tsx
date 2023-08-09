import { Route, Routes } from 'react-router-dom';
import Records from './pages/Records';

const App = () => {
  return (
    <Routes>
      <Route path="/records" element={<Records />} />
    </Routes>
  );
};

export default App;
