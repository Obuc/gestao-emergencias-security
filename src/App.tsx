import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';

const App = () => {
  return (
    <Routes>
      <Route
        path="/home"
        element={
          <h1>
            <Header />
            Teste
          </h1>
        }
      />
    </Routes>
  );
};

export default App;
