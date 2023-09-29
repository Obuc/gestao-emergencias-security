import { format, isSameDay, isSameMonth, isToday } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { useSchedule } from '../hooks/useSchedule';
import Select, { SelectItem } from '../../../components/Select';
import { Button } from '../../../components/Button';
import { ptBR } from 'date-fns/locale';

const Calendar = () => {
  const {
    dateSelected,
    setDateSected,
    nextMonth,
    prevMonth,
    weeks,
    selectedMonth,
    setSelectedMonth,
    monthsList,
    selectedYear,
    setSelectedYear,
    generateDateList,
    dataEquipments,
  } = useSchedule();

  const dateList = generateDateList();

  const handleMonthChange = (value: any) => {
    setSelectedMonth(parseInt(value, 10));
  };

  console.log(dataEquipments);

  return (
    <div className="flex gap-8 h-full items-center w-full justify-between">
      <div className="flex w-[45.9375rem] h-full bg-white">
        <div className="flex flex-col w-full shadow-xs-primary-app">
          <div className="flex justify-between px-4 h-[4.625rem] items-center text-primary bg-[#F2F3F7]">
            <h2 className="text-2xl font-medium">
              {monthsList[selectedMonth].label} {selectedYear}
            </h2>

            <div className="flex justify-between p-2 bg-white/70 rounded-full w-[5.125rem] h-[2.25rem]">
              <button className="w-[1.25rem] h-[1.25rem]" onClick={prevMonth}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button className="w-[1.25rem] h-[1.25rem]" onClick={nextMonth}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full px-4 pb-4">
            <table className="h-full text-center text-lg text-[#303030]">
              <thead>
                <tr className="h-[6.25rem] text-xl text-primary font-medium">
                  <th className="font-medium">Dom</th>
                  <th className="font-medium">Seg</th>
                  <th className="font-medium">Ter</th>
                  <th className="font-medium">Qua</th>
                  <th className="font-medium">Qui</th>
                  <th className="font-medium">Sex</th>
                  <th className="font-medium">Sáb</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, weekIndex) => (
                  <tr key={weekIndex} className="h-[6.25rem] bg-white border border-[#F3F3F3]">
                    {week.map((day) => (
                      <td
                        key={day?.toISOString()}
                        data-istoday={dateSelected && day ? isSameDay(day, dateSelected) : day && isToday(day)}
                        data-isdayinmonth={day && day.getMonth() !== selectedMonth}
                        onClick={() => {
                          if (day && day.getMonth() === selectedMonth) {
                            setDateSected(day);
                          }
                        }}
                        className="w-[5.625rem] data-[isdayinmonth=false]:border border-[#F3F3F3] data-[isdayinmonth=true]:bg-[#F2F3F7] data-[isdayinmonth=true]:text-[#929292] data-[istoday=true]:bg-[#00617F] data-[istoday=true]:text-[#FBFBFB]
                        data-[isdayinmonth=false]:cursor-pointer data-[isdayinmonth=true]:cursor-not-allowed"
                      >
                        {day ? day.getDate() : ''}
                        {/* Renderize seus eventos aqui */}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex flex-1 h-full">
        <div className="flex flex-col w-full h-full shadow-xs-primary-app">
          <div className="flex items-center justify-between min-h-[4.625rem] bg-[#F2F3F7] px-4">
            <div className="flex gap-6">
              <Select
                id="month"
                name="month"
                className="w-[11.25rem]"
                variant="outline"
                value={selectedMonth.toString()}
                onValueChange={handleMonthChange}
              >
                {monthsList.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                id="year"
                name="year"
                variant="outline"
                className="w-[11.25rem]"
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(+value)}
              >
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </Select>
            </div>
            <div>
              <Button.Root
                className="w-[6.875rem] h-10"
                onClick={() => {
                  const today = new Date();
                  setDateSected(new Date());
                  setSelectedMonth(today.getMonth());
                  setSelectedYear(today.getFullYear());
                }}
              >
                <Button.Label>Hoje</Button.Label>
              </Button.Root>
            </div>
          </div>

          <div className="bg-white overflow-scroll h-full w-full">
            {dateList.map((date, index) => (
              <div className="mt-6 border-b p-6 border-b-primary/10" key={index}>
                <span className="text-[1.375rem] text-primary font-semibold">
                  {format(date, "d 'de' MMMM - EEE", { locale: ptBR })}
                </span>
                <ul className="pt-4 pb-6">
                  {dataEquipments &&
                    dataEquipments
                      .filter((equipment) => {
                        // Verifique se alguma das próximas inspeções está dentro do mês atual
                        return equipment.proximas_inspecoes?.some((proximaInspecao) => {
                          return isSameMonth(proximaInspecao, date);
                        });
                      })
                      .map((equipment, equipmentIndex) => (
                        <li
                          data-isexpired={equipment.vencido}
                          className={`p-2 mb-2 rounded flex items-center justify-between ${
                            equipment.vencido ? 'bg-pink/20' : ''
                          }`}
                          key={equipmentIndex}
                        >
                          <span className="text-lg text-[#303030]">Inspeção - {equipment.type}</span>
                          <span data-isexpired={equipment.vencido} className={equipment.vencido ? 'text-pink' : ''}>
                            {format(equipment.proximas_inspecoes[0], 'dd MMM yyyy', { locale: ptBR })}
                          </span>
                        </li>
                      ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
