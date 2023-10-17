import { Select } from '../../../components/Select';
import { useSchedule } from '../hooks/useSchedule';

const CalendarList = () => {
  const { monthsList, selectedMonth, setSelectedMonth } = useSchedule();

  const handleMonthChange = (value: any) => {
    setSelectedMonth(parseInt(value, 10));
  };

  return (
    <div className="flex flex-col w-full h-full shadow-xs-primary-app">
      <div className="flex items-center justify-between h-[4.625rem] bg-[#F2F3F7] px-4">
        <div className="flex gap-6">
          <Select.Component
            id="month"
            name="month"
            className="w-[11.25rem]"
            popperWidth="w-[11.25rem]"
            variant="outline"
            value={selectedMonth.toString()}
            onValueChange={handleMonthChange}
          >
            {monthsList.map((month) => (
              <Select.Item key={month.value} value={month.value.toString()}>
                {month.label}
              </Select.Item>
            ))}
          </Select.Component>

          <Select.Component id="year" name="year" className="w-[11.25rem]" popperWidth="w-[11.25rem]" variant="outline">
            <Select.Item value="2023">2023</Select.Item>
          </Select.Component>
        </div>
        <div>Hoje</div>
      </div>
    </div>
  );
};

export default CalendarList;
