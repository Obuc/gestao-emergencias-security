import { useSharepointContext } from './context/sharepointContext';

const App = () => {
  const { crud } = useSharepointContext();

  const handlePhoto = async () => {
    const resp = await crud.getAllUsers({ url: 'http://localhost:8080', userName: 'Marcelo Silva' });
    console.log(resp);
  };

  return <div onClick={handlePhoto}>Hello Word</div>;
};

export default App;
