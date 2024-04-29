import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns/esm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, isBefore, isSameDay, isToday, subDays } from 'date-fns';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { useSchedule } from '../hooks/schedule';
import { ScheduleModal } from './schedule-modal';
import { DataEquipments } from '../types/schedule';

export const Schedule = () => {
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
    isLoadingDataEquipments,
  } = useSchedule();

  const navigate = useNavigate();
  const dateList = generateDateList();

  const handleMonthChange = (value: any) => {
    const selectedMonthInt = parseInt(value, 10);
    setSelectedMonth(selectedMonthInt);

    const firstDayOfSelectedMonth = new Date(selectedYear, selectedMonthInt, 1);

    setDateSected(firstDayOfSelectedMonth);
  };

  const handleOpenModalViewEquipment = (equipment: { id: number; type: string }) => {
    if (equipment) {
      navigate(`/bxo/schedule/${equipment.id}?equipment=${equipment.type}`);
    }
  };

  const filteredEvents = dataEquipments?.filter((equipment) => {
    return dateList.some((date) => {
      return (
        equipment &&
        (isSameDay(new Date(equipment.proxima_inspecao), date) || isSameDay(new Date(equipment.ultima_inspecao), date))
      );
    });
  });

  return (
    <>
      <div className="flex gap-8 h-full items-center w-full justify-between">
        <div className="flex w-[45.9375rem] h-full bg-white">
          <div className="flex flex-col w-full shadow-xs-primary-app">
            <div className="flex justify-between px-4 min-h-[4.625rem] items-center text-primary-font bg-[#F2F3F7]">
              <h2 className="text-2xl font-medium">
                {monthsList[selectedMonth].label} {selectedYear}
              </h2>

              <div className="flex justify-between p-2 bg-white/70 rounded-full w-[5.125rem] min-h-[2.25rem]">
                <button disabled={isLoadingDataEquipments} className="w-[1.25rem] h-[1.25rem]" onClick={prevMonth}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button disabled={isLoadingDataEquipments} className="w-[1.25rem] h-[1.25rem]" onClick={nextMonth}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>

            <div className="flex flex-col w-full h-full px-4 pb-4">
              <table className="h-full text-center text-lg text-[#303030]">
                <thead>
                  <tr className="h-[6.25rem] text-xl text-primary-font font-medium">
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
                      className="min-[1100px]:h-[3.875rem] relative min-[1500px]:h-[4.5rem] min-[1800px]:h-[5.75rem] bg-white border border-[#F3F3F3]"
                    >
                      {week.map((day) => {
                        const isDayInMonth = day && day.getMonth() === selectedMonth;

                        const isOverdue =
                          day &&
                          dataEquipments &&
                          dataEquipments.some((equipment) => {
                            const equipmentDate = equipment.proxima_inspecao;
                            return isDayInMonth && isBefore(equipmentDate, new Date()) && isSameDay(equipmentDate, day);
                          });

                        const isTodayInspection =
                          day &&
                          dataEquipments &&
                          dataEquipments.some((equipment) => {
                            return isDayInMonth && isSameDay(equipment.proxima_inspecao, day);
                          });

                        const isInspectionDone =
                          dataEquipments &&
                          dataEquipments.some((equipment) => {
                            return isDayInMonth && isSameDay(equipment.ultima_inspecao, day);
                          });

                        const isOverdueMultipleInspections =
                          dataEquipments &&
                          dataEquipments.some((equipment) => {
                            return (
                              isDayInMonth &&
                              differenceInDays(day, equipment.ultima_inspecao) > equipment.frequencia &&
                              isSameDay(equipment.proxima_inspecao, day)
                            );
                          });

                        const isOutOfTime =
                          dataEquipments &&
                          dataEquipments.some((equipment) => {
                            return (
                              isDayInMonth && equipment.realizada_fora_do_prazo && isSameDay(equipment.ultima_inspecao, day)
                            );
                          });

                        return (
                          <td
                            key={day?.toISOString()}
                            data-istoday={dateSelected && day ? isSameDay(day, dateSelected) : day && isToday(day)}
                            data-is-selected={dateSelected && day && isToday(day)}
                            data-isdayinmonth={day && day.getMonth() !== selectedMonth}
                            onClick={() => {
                              if (day && day.getMonth() === selectedMonth) {
                                setDateSected(day);
                              }
                            }}
                            className="w-[5.625rem] relative data-[isdayinmonth=false]:border border-[#F3F3F3] data-[isdayinmonth=true]:bg-[#F2F3F7] data-[isdayinmonth=true]:text-[#929292] data-[istoday=true]:shadow-[inset_0_0_4px_rgba(0,0,0,0.6)]
                          data-[isdayinmonth=false]:cursor-pointer data-[isdayinmonth=true]:cursor-not-allowed data-[is-selected=true]:bg-[#00617F] data-[is-selected=true]:text-white data-[is-selected=true]:font-bold"
                          >
                            <span
                              data-is-expired={isOverdue}
                              data-is-today-inspection={isTodayInspection && !isOverdue}
                              data-is-done={isInspectionDone && !isOverdue && !isTodayInspection}
                              data-is-overdue-multiple-inspections={isOverdueMultipleInspections}
                              data-is-out-of-time={isOutOfTime}
                              className="flex justify-center absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 items-center w-10 h-10 rounded-full data-[is-expired=true]:bg-pink data-[is-expired=true]:text-white data-[is-today-inspection=true]:bg-[#FFEE57] data-[is-today-inspection=true]:text-black data-[is-done=true]:bg-[#70EC364D] data-[is-overdue-multiple-inspections=true]:bg-[#443247] data-[is-overdue-multiple-inspections=true]:text-white data-[is-out-of-time=true]:border-2 data-[is-out-of-time=true]:border-pink"
                            >
                              {day && !isLoadingDataEquipments
                                ? day.getDate()
                                : isLoadingDataEquipments && <Skeleton className="w-[5.625rem] py-5" />}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="h-full mt-2  flex flex-col gap-2">
                <span className="text-primary-font text-xl font-medium">Legenda:</span>
                <div className="flex gap-4">
                  <div className="flex flex-1 gap-2 items-center">
                    <span className="w-5 h-5 rounded-full bg-[#70EC364D]" />
                    Inspeções Realizadas
                  </div>

                  <div className="flex flex-1 gap-2 items-center">
                    <span className="w-5 h-5 rounded-full bg-pink" />
                    Inspeções Vencidas
                  </div>

                  <div className="flex flex-1 gap-2 items-center">
                    <span className="w-5 h-5 rounded-full bg-[#FFEE57]" />
                    Próximas Inspeções
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex  gap-2 items-center">
                    <span className="w-5 h-5 bg-[#00617F]" />
                    Dia Atual
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className="w-5 h-5 rounded-full bg-[#443247]" />
                    Inspeção anterior não vencida ou não realizada
                  </div>
                </div>
              </div>
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
                  mode="gray"
                  value={monthsList[selectedMonth].label ?? ''}
                  onValueChange={handleMonthChange}
                  isLoading={isLoadingDataEquipments}
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
                  mode="gray"
                  onValueChange={(value) => setSelectedYear(+value)}
                  isLoading={isLoadingDataEquipments}
                >
                  <Select.Item value="2023">2023</Select.Item>
                  <Select.Item value="2022">2022</Select.Item>
                </Select.Component>
              </div>
              <div>
                <Button.Root
                  disabled={isLoadingDataEquipments}
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

            <h2 className="px-6 py-6 text-2xl text-primary-font font-medium bg-white">Proximos Eventos:</h2>

            <div className="bg-white overflow-scroll h-full w-full">
              {!filteredEvents ||
                (filteredEvents.length === 0 && (
                  <div className="p-6 text-xl text-primary-font">
                    <h2>Nenhum equipamento agendado nos próximos 30 dias para esta data.</h2>
                  </div>
                ))}

              {dateList.map((date, index) => {
                const eventsOnDateSet = new Set();
                const processedIds = new Set();

                dataEquipments?.forEach((equipment) => {
                  const isUltimaInspecaoOnDate = isSameDay(equipment.ultima_inspecao, date);
                  if (isSameDay(equipment.proxima_inspecao, date) || isUltimaInspecaoOnDate) {
                    if (!processedIds.has(equipment.Id)) {
                      eventsOnDateSet.add(equipment);
                      processedIds.add(equipment.Id);
                    }
                  }
                });

                const eventsOnDate: any[] = Array.from(eventsOnDateSet);
                if (eventsOnDate.length === 0) {
                  return null;
                }

                return (
                  <div className="border-b p-6 border-b-primary/10" key={index}>
                    {!isLoadingDataEquipments && (
                      <span className="text-[1.375rem] text-primary-font font-semibold">
                        {format(date, "d 'de' MMMM - EEE", { locale: ptBR })}
                      </span>
                    )}

                    {isLoadingDataEquipments && <Skeleton className="w-full py-4" />}
                    {isLoadingDataEquipments && (
                      <ul className="pb-6">
                        <li className="px-2">
                          <Skeleton className="w-full py-4" />
                        </li>
                      </ul>
                    )}

                    {!isLoadingDataEquipments && (
                      <ul className="pt-4 pb-6">
                        {eventsOnDate?.map((equipment: DataEquipments, equipmentIndex) => {
                          const isOverdue = isBefore(equipment.proxima_inspecao, new Date());
                          const isInspectionDone = isSameDay(equipment.ultima_inspecao, date);
                          const isTodayInspection = isSameDay(equipment.proxima_inspecao, date);
                          const isOutOfTime = equipment.realizada_fora_do_prazo;

                          const isOverdueMultipleInspections =
                            differenceInDays(date, equipment.ultima_inspecao) > equipment.frequencia;

                          // console.log({
                          //   id: equipment.Id,
                          //   isOutOfTime: isOutOfTime,
                          //   // equipamento: equipment.type,
                          //   // ultima_inspecao: equipment.ultima_inspecao,
                          //   // data: date,
                          //   // isInspectionDone: isInspectionDone,
                          //   // isTodayInspection: !isTodayInspection,
                          //   // isOverdue: isOverdue,
                          //   // proxima_inspecao: equipment.proxima_inspecao,
                          //   // isDoneFunction: isSameDay(equipment.ultima_inspecao, date),
                          //   // isOverdueMultipleInspections: isOverdueMultipleInspections,
                          //   // diff_dias: differenceInDays(date, equipment.ultima_inspecao),
                          // });

                          return (
                            <li
                              data-is-overdue={isOverdue && !isInspectionDone}
                              data-is-today={isTodayInspection && !isOverdue}
                              data-is-done={isInspectionDone && !isTodayInspection}
                              data-is-overdue-multiple-inspections={isOverdueMultipleInspections}
                              data-is-out-of-time={isOutOfTime && !isTodayInspection}
                              className="p-2 mb-2 data-[is-overdue=true]:bg-[#FF316233] data-[is-done=true]:bg-[#70EC36]/20 data-[is-today=true]:bg-[#FFEE5733] data-[is-overdue-multiple-inspections=true]:bg-[#443247]/20 data-[is-out-of-time=true]:border-2 data-[is-out-of-time=true]:border-pink rounded flex justify-between items-center gap-2 cursor-pointer"
                              key={equipmentIndex}
                              onClick={() => handleOpenModalViewEquipment({ id: equipment.Id, type: equipment.type })}
                            >
                              <div className="flex gap-2 items-center">
                                <div
                                  data-is-overdue={isOverdue && !isInspectionDone}
                                  data-is-today={isTodayInspection && !isOverdue}
                                  data-is-done={isInspectionDone && !isTodayInspection}
                                  data-is-overdue-multiple-inspections={isOverdueMultipleInspections}
                                  className="flex justify-between w-3 h-3 data-[is-overdue=true]:bg-pink data-[is-done=true]:bg-[#70EC36] data-[is-today=true]:bg-[#FFEE57] data-[is-overdue-multiple-inspections=true]:bg-[#443247] rounded-full"
                                />
                                <span className="text-lg text-[#303030]">Inspeção - {equipment.type}</span>
                              </div>

                              <span className="font-medium">
                                <>
                                  {isOverdueMultipleInspections &&
                                    `Inspeção dia ${format(
                                      subDays(date, equipment.frequencia),
                                      'dd/MM/yyyy',
                                    )} não realizada ou não vencida`}

                                  {isOutOfTime &&
                                    !isTodayInspection &&
                                    ` Inspeção Realizada fora do prazo. Deveria ter sido realizada em ${format(
                                      equipment.deveria_ser_realizada,
                                      'dd/MM/yyyy',
                                    )}`}
                                </>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ScheduleModal />
    </>
  );
};
