import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      <Route path="/home" element={<h1>Teste</h1>} />
    </Routes>
  );
};

export default App;
