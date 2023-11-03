import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Calendar from './components/Calendar';
import LayoutBase from '../../layout/LayoutBase';

const Schedule = () => {
  const navigate = useNavigate();
  const localSite = localStorage.getItem('user_site');

  useEffect(() => {
    if (localSite === null) {
      navigate('/');
    }
  }, [localSite]);

  return (
    <LayoutBase showMenu>
      <div className="flex flex-col w-full justify-between bg-[#FBFBFB]">
        <div className="flex flex-col p-8 h-full">
          <Calendar />
        </div>
      </div>
    </LayoutBase>
  );
};

export default Schedule;
