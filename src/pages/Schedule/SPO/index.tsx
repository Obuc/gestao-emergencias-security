import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LayoutBase from '@/layout/LayoutBase';
import { Schedule } from './components/schedule';

const ScheduleSpo = () => {
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
          <Schedule />
        </div>
      </div>
    </LayoutBase>
  );
};

export default ScheduleSpo;
