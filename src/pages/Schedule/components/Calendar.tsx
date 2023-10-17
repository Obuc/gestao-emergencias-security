import { ptBR } from 'date-fns/locale';
import { format, isSameDay, isToday } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { useSchedule } from '../hooks/useSchedule';
import { Button } from '../../../components/Button';
import { Select } from '../../../components/Select';

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

  return (
    <div className="flex gap-8 h-full items-center w-full justify-between">
      <div className="flex w-[45.9375rem] h-full bg-white">
        <div className="flex flex-col w-full shadow-xs-primary-app">
          <div className="flex justify-between px-4 min-h-[4.625rem] items-center text-primary bg-[#F2F3F7]">
            <h2 className="text-2xl font-medium">
              {monthsList[selectedMonth].label} {selectedYear}
            </h2>

            <div className="flex justify-between p-2 bg-white/70 rounded-full w-[5.125rem] min-h-[2.25rem]">
              <button className="w-[1.25rem] h-[1.25rem]" onClick={prevMonth}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button className="w-[1.25rem] h-[1.25rem]" onClick={nextMonth}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full h-full px-4 pb-4">
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
                  <tr
                    key={weekIndex}
                    className="min-[1100px]:h-[5rem] relative min-[1500px]:h-[5.625rem] min-[1800px]:h-[6.875rem] bg-white border border-[#F3F3F3]"
                  >
                    {week.map((day) => {
                      return (
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
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* {weeks.map((week, weekIndex) => (
                  <tr
                    key={weekIndex}
                    className="min-[1100px]:h-[4.6875rem] relative min-[1600px]:h-[6.25rem] min-[1800px]:h-[6.5625rem] bg-white border border-[#F3F3F3]"
                  >
                    {week.map((day) => {
                      const isDayInMonth = day && day.getMonth() === selectedMonth;

                      const isInspectionDone =
                        dataEquipments &&
                        dataEquipments.some((equipment) => {
                          // Verificar se a inspeção foi feita para este dia
                          return (
                            isDayInMonth &&
                            equipment.ultima_inspecao &&
                            new Date(equipment.ultima_inspecao).getDate() === day.getDate() &&
                            new Date(equipment.ultima_inspecao).getMonth() === selectedMonth &&
                            new Date(equipment.ultima_inspecao).getFullYear() === selectedYear
                          );
                        });

                      const isOverdue =
                        dateSelected &&
                        day &&
                        dataEquipments &&
                        dataEquipments.some((equipment) => {
                          return (
                            isDayInMonth &&
                            equipment.proxima_inspecao &&
                            new Date(equipment.proxima_inspecao) < day &&
                            isSameDay(new Date(equipment.proxima_inspecao), day)
                          );
                        });

                      const isTodayInspection =
                        dateSelected &&
                        day &&
                        dataEquipments &&
                        dataEquipments.some((equipment) => {
                          return (
                            isDayInMonth &&
                            equipment.proxima_inspecao &&
                            isSameDay(new Date(equipment.proxima_inspecao), day)
                          );
                        });

                      const isMissedInspection =
                        dateSelected &&
                        day &&
                        dataEquipments &&
                        dataEquipments.some((equipment) => {
                          return (
                            isDayInMonth &&
                            !isInspectionDone &&
                            equipment.proxima_inspecao &&
                            new Date(equipment.proxima_inspecao) < day &&
                            isSameDay(new Date(equipment.proxima_inspecao), day)
                          );
                        });

                      return (
                        <td
                          key={day?.toISOString()}
                          data-is-inspection-done={isInspectionDone}
                          data-is-overdue={isOverdue}
                          data-is-missed-inspection={isMissedInspection}
                          data-is-today-inspection={isTodayInspection}
                          data-istoday={dateSelected && day ? isSameDay(day, dateSelected) : day && isToday(day)}
                          data-isdayinmonth={day && day.getMonth() !== selectedMonth}
                          onClick={() => {
                            if (day && isDayInMonth) {
                              setDateSected(day);
                            }
                          }}
                          className={`w-[5.625rem] data-[isdayinmonth=false]:border border-[#F3F3F3] data-[isdayinmonth=true]:bg-[#F2F3F7] data-[isdayinmonth=true]:text-[#929292] data-[istoday=true]:bg-[#00617F] data-[istoday=true]:text-[#FBFBFB] data-[isdayinmonth=false]:cursor-pointer data-[isdayinmonth=true]:cursor-not-allowed
                      ${isInspectionDone ? 'bg-green-400' : ''}
                      ${isOverdue ? 'bg-pink' : ''}
                      ${isMissedInspection ? 'bg-yellow-400' : ''}
                      ${isTodayInspection ? 'bg-blue-400' : ''}`}
                        >
                          {day ? day.getDate() : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex flex-1 h-full">
        <div className="flex flex-col w-full h-full shadow-xs-primary-app">
          <div className="flex items-center justify-between min-h-[4.625rem] bg-[#F2F3F7] px-4">
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
                    {month?.label}
                  </Select.Item>
                ))}
              </Select.Component>

              <Select.Component
                id="year"
                name="year"
                variant="outline"
                className="w-[11.25rem]"
                popperWidth="w-[11.25rem]"
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(+value)}
              >
                <Select.Item value="2023">2023</Select.Item>
                <Select.Item value="2022">2022</Select.Item>
              </Select.Component>
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
            {dateList.map((date, index) => {
              const eventsOnDate = dataEquipments?.filter((equipment) => isSameDay(equipment.proxima_inspecao, date));
              if (eventsOnDate?.length === 0) {
                return null;
              }
              return (
                <div className="mt-6 border-b p-6 border-b-primary/10" key={index}>
                  <span className="text-[1.375rem] text-primary font-semibold">
                    {format(date, "d 'de' MMMM - EEE", { locale: ptBR })}
                  </span>
                  <ul className="pt-4 pb-6">
                    {eventsOnDate?.map((equipment, equipmentIndex) => (
                      <li
                        className="p-2 mb-2 bg-[#FFEE5733] rounded flex items-center gap-2 cursor-pointer"
                        key={equipmentIndex}
                        onClick={() => console.log(equipment)}
                      >
                        <>
                          <div className="w-3 h-3 bg-[#FFEE57] rounded-full" />
                          <span className="text-lg text-[#303030]">Inspeção - {equipment.type}</span>
                        </>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
