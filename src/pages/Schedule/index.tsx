import LayoutBase from '../../layout/LayoutBase';
import Calendar from './components/Calendar';

const Schedule = () => {
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
