import { useState } from 'react';
import { addDays, parseISO } from 'date-fns';
import { useParams, useSearchParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { DataEquipments, DataEquipmentsModal } from '../types/schedule.types';

export const useSchedule = () => {
  const { crudParent } = sharepointContext();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const equipmentModal = searchParams.get('equipment');

  const [dateSelected, setDateSected] = useState<Date | null>(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const getDaysInMonth = (monthValue: number, yearValue: number) => {
    const year = yearValue;
    const month = monthValue;
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth: Date[] = [];

    const lastDayOfPreviousMonth = new Date(year, month, 0).getDate();

    for (let i = firstDayOfWeek; i > 0; i--) {
      daysInMonth.push(new Date(year, month - 1, lastDayOfPreviousMonth - i + 1));
    }

    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= lastDayOfMonth; day++) {
      daysInMonth.push(new Date(year, month, day));
    }

    const daysToAdd = 42 - daysInMonth.length;
    for (let day = 1; day <= daysToAdd; day++) {
      daysInMonth.push(new Date(year, month + 1, day));
    }
    return daysInMonth;
  };

  const nextMonth = () => {
    const newMonth = selectedMonth + 1;
    const newYear = selectedYear + Math.floor(newMonth / 12);
    setSelectedMonth(newMonth % 12);
    setSelectedYear(newYear);
  };

  const prevMonth = () => {
    let newMonth = selectedMonth - 1;
    let newYear = selectedYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const chunkArray = (array: (Date | null)[], chunkSize: number) => {
    const results = [];
    while (array.length) {
      results.push(array.splice(0, chunkSize));
    }
    return results;
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const weeks = chunkArray(daysInMonth, 7);

  const generateDateList = () => {
    let startDate;
    if (dateSelected) {
      startDate = new Date(dateSelected);
    } else {
      startDate = new Date();
    }

    const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 29);
    const dateList = [];

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      dateList.push(new Date(date));
    }

    return dateList;
  };

  const monthsList = [
    { value: 0, label: 'Janeiro' },
    { value: 1, label: 'Fevereiro' },
    { value: 2, label: 'Março' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Maio' },
    { value: 5, label: 'Junho' },
    { value: 6, label: 'Julho' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Setembro' },
    { value: 9, label: 'Outubro' },
    { value: 10, label: 'Novembro' },
    { value: 11, label: 'Dezembro' },
  ];

  const calculateTimeToExpiration = (type: string) => {
    switch (type) {
      case 'Extintor':
        return 30;

      case 'Valvula':
        return 90;

      case 'Casa':
        return 1;

      case 'Bomba':
        return 1;

      case 'DEA':
        return 7;

      case 'OEI':
        return 7;

      case 'Porta':
        return 90;

      case 'Alarme':
        return 7;

      case 'Ambulancia':
        return 1;

      case 'Hidrante':
        return 30;

      default:
        0;
    }
  };

  const fetchExtinguisher = async () => {
    const path = `?$Select=Id,Created,Modified,codExtintor,Predio,Pavimento,LocEsp,Tipo,Conforme,Title,ultimaInsp,Excluido&$Filter=(Excluido eq 'Não' or Excluido eq null) and (ultimaInsp ne null)`;
    const resp = await crudParent.getListItemsv2('Extintores_Equipamentos', path);

    const data = resp.results.map((extinguisher: any) => {
      const ultimaInspecaoIsoDate = parseISO(extinguisher.ultimaInsp);
      const ultimaInspecao = new Date(ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000);

      const timeToExpiration = calculateTimeToExpiration('Extintor');

      const dates = [];

      for (let i = 0; i < 10; i++) {
        if (timeToExpiration) {
          const nextInspection = new Date(ultimaInspecao.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);

          dates.push({
            type: 'Extintor',
            Id: extinguisher.Id,
            ultima_inspecao: ultimaInspecao,
            proxima_inspecao: nextInspection,
            frequencia: timeToExpiration,
          });
        }
      }

      return dates;
    });

    const combinedData = data.reduce((acc: any, curr: any) => acc.concat(curr), []);
    return combinedData;
  };

  const fetchValve = async () => {
    const path = `?$Select=Id,Tipo,Codigo,Predio,LocEsp,Title,ultimaInsp,Excluido&$Top=25&$Filter=(Excluido eq 'false' or Excluido eq null) and (Tipo eq 'Valvula') and (ultimaInsp ne null)`;

    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', path);

    const data = resp.results.map((equipment: any) => {
      const ultimaInspecaoIsoDate = parseISO(equipment.ultimaInsp);
      const ultimaInspecao = new Date(ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000);
      const timeToExpiration = calculateTimeToExpiration('Valvula');

      const dates = [];
      let nextInspection = ultimaInspecao;

      for (let i = 0; i < 10; i++) {
        if (timeToExpiration) {
          nextInspection = new Date(nextInspection.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);
          dates.push({
            type: 'Valvula',
            Id: equipment.Id,
            ultima_inspecao: ultimaInspecao,
            proxima_inspecao: nextInspection,
            frequencia: timeToExpiration,
          });
        }
      }

      return dates;
    });

    const combinedData = data.reduce((acc: any, curr: any) => acc.concat(curr), []);
    return combinedData;
  };

  const fetchPump = async () => {
    const path = `?$Select=Id,Tipo,Codigo,Predio,LocEsp,Title,ultimaInsp,Excluido&$Top=25&$Filter=(Excluido eq 'false' or Excluido eq null) and (Tipo eq 'Casa') and (ultimaInsp ne null)`;

    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', path);

    const data = resp.results.map((equipment: any) => {
      const ultimaInspecaoIsoDate = parseISO(equipment.ultimaInsp);
      const ultimaInspecao = new Date(ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000);
      const timeToExpiration = calculateTimeToExpiration('Casa');

      const dates = [];
      let nextInspection = ultimaInspecao;

      for (let i = 0; i < 10; i++) {
        if (timeToExpiration) {
          nextInspection = new Date(nextInspection.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);
          dates.push({
            type: 'Casa',
            Id: equipment.Id,
            ultima_inspecao: ultimaInspecao,
            proxima_inspecao: nextInspection,
            frequencia: timeToExpiration,
          });
        }
      }

      return dates;
    });

    const combinedData = data.reduce((acc: any, curr: any) => acc.concat(curr), []);
    return combinedData;
  };

  const fetchBomb = async () => {
    const path = `?$Select=Id,Tipo,Codigo,Predio,LocEsp,Title,ultimaInsp,Excluido&$Top=25&$Filter=(Excluido eq 'false' or Excluido eq null) and (Tipo eq 'Bomba') and (ultimaInsp ne null)`;

    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', path);

    const data = resp.results.map((equipment: any) => {
      const ultimaInspecaoIsoDate = parseISO(equipment.ultimaInsp);
      const ultimaInspecao = new Date(ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000);
      const timeToExpiration = calculateTimeToExpiration('Bomba');

      const dates = [];
      let nextInspection = ultimaInspecao;

      for (let i = 0; i < 10; i++) {
        if (timeToExpiration) {
          nextInspection = new Date(nextInspection.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);
          dates.push({
            type: 'Bomba',
            Id: equipment.Id,
            ultima_inspecao: ultimaInspecao,
            proxima_inspecao: nextInspection,
            frequencia: timeToExpiration,
          });
        }
      }

      return dates;
    });

    const combinedData = data.reduce((acc: any, curr: any) => acc.concat(curr), []);
    return combinedData;
  };

  const fetchDea = async () => {
    const path = `?$Select=Id,Tipo,Codigo,Predio,LocEsp,Title,ultimaInsp,Excluido&$Top=25&$Filter=(Excluido eq 'false' or Excluido eq null) and (Tipo eq 'DEA') and (ultimaInsp ne null)`;

    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', path);

    const data = resp.results.map((equipment: any) => {
      const ultimaInspecaoIsoDate = parseISO(equipment.ultimaInsp);
      const ultimaInspecao = new Date(ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000);
      const timeToExpiration = calculateTimeToExpiration('DEA');

      const dates = [];
      let nextInspection = ultimaInspecao;

      for (let i = 0; i < 10; i++) {
        if (timeToExpiration) {
          nextInspection = new Date(nextInspection.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);
          dates.push({
            type: 'DEA',
            Id: equipment.Id,
            ultima_inspecao: ultimaInspecao,
            proxima_inspecao: nextInspection,
            frequencia: timeToExpiration,
          });
        }
      }

      return dates;
    });

    const combinedData = data.reduce((acc: any, curr: any) => acc.concat(curr), []);
    return combinedData;
  };

  const fetchOEI = async () => {
    const path = `?$Select=Id,Tipo,Codigo,Predio,LocEsp,Title,ultimaInsp,Excluido&$Top=25&$Filter=(Excluido eq 'false' or Excluido eq null) and (Tipo eq 'OEI') and (ultimaInsp ne null)`;

    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', path);

    const data = resp.results.map((equipment: any) => {
      const ultimaInspecaoIsoDate = parseISO(equipment.ultimaInsp);
      const ultimaInspecao = new Date(ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000);
      const timeToExpiration = calculateTimeToExpiration('OEI');

      const dates = [];
      let nextInspection = ultimaInspecao;

      for (let i = 0; i < 10; i++) {
        if (timeToExpiration) {
          nextInspection = new Date(nextInspection.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);
          dates.push({
            type: 'OEI',
            Id: equipment.Id,
            ultima_inspecao: ultimaInspecao,
            proxima_inspecao: nextInspection,
            frequencia: timeToExpiration,
          });
        }
      }

      return dates;
    });

    const combinedData = data.reduce((acc: any, curr: any) => acc.concat(curr), []);
    return combinedData;
  };

  const fetchDoor = async () => {
    const path = `?$Select=Id,Tipo,Codigo,Predio,LocEsp,Title,ultimaInsp,Excluido&$Top=25&$Filter=(Excluido eq 'false' or Excluido eq null) and (Tipo eq 'Porta') and (ultimaInsp ne null)`;

    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', path);

    const data = resp.results.map((equipment: any) => {
      const ultimaInspecaoIsoDate = parseISO(equipment.ultimaInsp);
      const ultimaInspecao = new Date(ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000);
      const timeToExpiration = calculateTimeToExpiration('Porta');

      const dates = [];
      let nextInspection = ultimaInspecao;

      for (let i = 0; i < 10; i++) {
        if (timeToExpiration) {
          nextInspection = new Date(nextInspection.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);
          dates.push({
            type: 'Porta',
            Id: equipment.Id,
            ultima_inspecao: ultimaInspecao,
            proxima_inspecao: nextInspection,
            frequencia: timeToExpiration,
          });
        }
      }

      return dates;
    });

    const combinedData = data.reduce((acc: any, curr: any) => acc.concat(curr), []);
    return combinedData;
  };

  const fetchAlarm = async () => {
    const path = `?$Select=Id,Tipo,Codigo,Predio,LocEsp,Title,ultimaInsp,Excluido&$Top=25&$Filter=(Excluido eq 'false' or Excluido eq null) and (Tipo eq 'Alarme') and (ultimaInsp ne null)`;

    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', path);

    const data = resp.results.map((equipment: any) => {
      const ultimaInspecaoIsoDate = parseISO(equipment.ultimaInsp);
      const ultimaInspecao = new Date(ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000);
      const timeToExpiration = calculateTimeToExpiration('Alarme');

      const dates = [];
      let nextInspection = ultimaInspecao;

      for (let i = 0; i < 10; i++) {
        if (timeToExpiration) {
          nextInspection = new Date(nextInspection.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);
          dates.push({
            type: 'Alarme',
            Id: equipment.Id,
            ultima_inspecao: ultimaInspecao,
            proxima_inspecao: nextInspection,
            frequencia: timeToExpiration,
          });
        }
      }

      return dates;
    });

    const combinedData = data.reduce((acc: any, curr: any) => acc.concat(curr), []);
    return combinedData;
  };

  const fetchAmbulance = async () => {
    const path = `?$Select=Id,Tipo,Codigo,Predio,LocEsp,Title,ultimaInsp,Excluido&$Top=25&$Filter=(Excluido eq 'false' or Excluido eq null) and (Tipo eq 'Ambulancia') and (ultimaInsp ne null)`;

    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', path);

    const data = resp.results.map((equipment: any) => {
      const ultimaInspecaoIsoDate = parseISO(equipment.ultimaInsp);
      const ultimaInspecao = new Date(ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000);
      const timeToExpiration = calculateTimeToExpiration('Ambulancia');

      const dates = [];
      let nextInspection = ultimaInspecao;

      for (let i = 0; i < 10; i++) {
        if (timeToExpiration) {
          nextInspection = new Date(nextInspection.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);
          dates.push({
            type: 'Ambulancia',
            Id: equipment.Id,
            ultima_inspecao: ultimaInspecao,
            proxima_inspecao: nextInspection,
            frequencia: timeToExpiration,
          });
        }
      }

      return dates;
    });

    const combinedData = data.reduce((acc: any, curr: any) => acc.concat(curr), []);
    return combinedData;
  };

  const fetchHydrant = async () => {
    const path = `?$Select=Id,Predio,LocEsp,Title,ultimaInsp,Excluido&$Top=25&$Filter=(Excluido eq 'false' or Excluido eq null) and (ultimaInsp ne null)`;

    const resp = await crudParent.getListItemsv2('Hidrantes_Equipamentos', path);

    const data = resp.results.map((equipment: any) => {
      const ultimaInspecaoIsoDate = parseISO(equipment.ultimaInsp);
      const ultimaInspecao = new Date(ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000);
      const timeToExpiration = calculateTimeToExpiration('Hidrante');

      const dates = [];
      let nextInspection = ultimaInspecao;

      for (let i = 0; i < 10; i++) {
        if (timeToExpiration) {
          nextInspection = new Date(nextInspection.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);
          dates.push({
            type: 'Hidrante',
            Id: equipment.Id,
            ultima_inspecao: ultimaInspecao,
            proxima_inspecao: nextInspection,
            frequencia: timeToExpiration,
          });
        }
      }

      return dates;
    });

    const combinedData = data.reduce((acc: any, curr: any) => acc.concat(curr), []);
    return combinedData;
  };

  const { data: dataEquipments, isLoading: isLoadingDataEquipments }: UseQueryResult<Array<DataEquipments>> = useQuery({
    queryKey: ['schedule_data_spo'],
    queryFn: async () => {
      const extinguiserData = await fetchExtinguisher();
      const valveData = await fetchValve();
      const pumpData = await fetchPump();
      const bombData = await fetchBomb();
      const deaData = await fetchDea();
      const oeiData = await fetchOEI();
      const doorData = await fetchDoor();
      const alarmData = await fetchAlarm();
      const ambulanceData = await fetchAmbulance();
      const hydrantData = await fetchHydrant();

      const combinedData = [
        ...extinguiserData,
        ...valveData,
        ...pumpData,
        ...bombData,
        ...deaData,
        ...oeiData,
        ...doorData,
        ...alarmData,
        ...ambulanceData,
        ...hydrantData,
      ];
      return combinedData;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
  });

  const fechExtinguisherData = async (extinguisherId: string) => {
    const resp = await crudParent.getListItemsv2(
      'Extintores_Equipamentos',
      `?$Select=Id,Predio,Pavimento,LocEsp,ultimaInsp&$Filter=(Id eq '${extinguisherId}')`,
    );
    return resp.results[0];
  };

  const fechMiscellaneousEquipmentData = async (id: string) => {
    const resp = await crudParent.getListItemsv2(
      'Diversos_Equipamentos',
      `?$Select=Id,Predio,LocEsp,ultimaInsp&$Filter=(Id eq '${id}')`,
    );
    return resp.results[0];
  };

  const fechHydrantData = async (id: string) => {
    const resp = await crudParent.getListItemsv2(
      'Hidrantes_Equipamentos',
      `?$Select=Id,Predio,LocEsp,ultimaInsp&$Filter=(Id eq '${id}')`,
    );
    return resp.results[0];
  };

  const { data: dataEquipmentsModal, isLoading: isLoadingDataEquipmentsModal }: UseQueryResult<DataEquipmentsModal> =
    useQuery({
      queryKey:
        params.id !== undefined && equipmentModal !== null
          ? ['schedule_data_modal_spo', params.id, equipmentModal]
          : ['schedule_data_modal_spo'],
      queryFn: async () => {
        if (params.id && equipmentModal === 'Extintor') {
          const extinguisher = await fechExtinguisherData(params.id);
          const ultimaInspecaoIsoDate = parseISO(extinguisher.ultimaInsp);

          const ultimaInspecao = new Date(
            ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
          );

          const timeToExpiration = calculateTimeToExpiration('Extintor');
          const proximaInspecao = timeToExpiration && addDays(ultimaInspecao, timeToExpiration);

          return {
            ...extinguisher,
            predio: extinguisher?.Predio,
            pavimento: extinguisher?.Pavimento,
            local: extinguisher?.LocEsp,
            ultima_inspecao: ultimaInspecao,
            proximaInspecao: proximaInspecao,
          };
        }

        if (params.id && equipmentModal === 'Valvula') {
          const valve = await fechMiscellaneousEquipmentData(params.id);
          const ultimaInspecaoIsoDate = parseISO(valve.ultimaInsp);

          const ultimaInspecao = new Date(
            ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
          );

          const timeToExpiration = calculateTimeToExpiration('Valvula');
          const proximaInspecao = timeToExpiration && addDays(ultimaInspecao, timeToExpiration);

          return {
            ...valve,
            predio: valve?.Predio ?? '-',
            pavimento: valve?.Pavimento ?? '-',
            local: valve?.LocEsp ?? '-',
            ultima_inspecao: ultimaInspecao,
            proximaInspecao: proximaInspecao,
          };
        }

        if (params.id && equipmentModal === 'Casa') {
          const valve = await fechMiscellaneousEquipmentData(params.id);
          const ultimaInspecaoIsoDate = parseISO(valve.ultimaInsp);

          const ultimaInspecao = new Date(
            ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
          );

          const timeToExpiration = calculateTimeToExpiration('Casa');
          const proximaInspecao = timeToExpiration && addDays(ultimaInspecao, timeToExpiration);

          return {
            ...valve,
            predio: valve?.Predio ?? '-',
            pavimento: valve?.Pavimento ?? '-',
            local: valve?.LocEsp ?? '-',
            ultima_inspecao: ultimaInspecao,
            proximaInspecao: proximaInspecao,
          };
        }

        if (params.id && equipmentModal === 'Bomba') {
          const valve = await fechMiscellaneousEquipmentData(params.id);
          const ultimaInspecaoIsoDate = parseISO(valve.ultimaInsp);

          const ultimaInspecao = new Date(
            ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
          );

          const timeToExpiration = calculateTimeToExpiration('Bomba');
          const proximaInspecao = timeToExpiration && addDays(ultimaInspecao, timeToExpiration);

          return {
            ...valve,
            predio: valve?.Predio ?? '-',
            pavimento: valve?.Pavimento ?? '-',
            local: valve?.LocEsp ?? '-',
            ultima_inspecao: ultimaInspecao,
            proximaInspecao: proximaInspecao,
          };
        }

        if (params.id && equipmentModal === 'DEA') {
          const valve = await fechMiscellaneousEquipmentData(params.id);
          const ultimaInspecaoIsoDate = parseISO(valve.ultimaInsp);

          const ultimaInspecao = new Date(
            ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
          );

          const timeToExpiration = calculateTimeToExpiration('DEA');
          const proximaInspecao = timeToExpiration && addDays(ultimaInspecao, timeToExpiration);

          return {
            ...valve,
            predio: valve?.Predio ?? '-',
            pavimento: valve?.Pavimento ?? '-',
            local: valve?.LocEsp ?? '-',
            ultima_inspecao: ultimaInspecao,
            proximaInspecao: proximaInspecao,
          };
        }

        if (params.id && equipmentModal === 'OEI') {
          const valve = await fechMiscellaneousEquipmentData(params.id);
          const ultimaInspecaoIsoDate = parseISO(valve.ultimaInsp);

          const ultimaInspecao = new Date(
            ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
          );

          const timeToExpiration = calculateTimeToExpiration('OEI');
          const proximaInspecao = timeToExpiration && addDays(ultimaInspecao, timeToExpiration);

          return {
            ...valve,
            predio: valve?.Predio ?? '-',
            pavimento: valve?.Pavimento ?? '-',
            local: valve?.LocEsp ?? '-',
            ultima_inspecao: ultimaInspecao,
            proximaInspecao: proximaInspecao,
          };
        }

        if (params.id && equipmentModal === 'Porta') {
          const valve = await fechMiscellaneousEquipmentData(params.id);
          const ultimaInspecaoIsoDate = parseISO(valve.ultimaInsp);

          const ultimaInspecao = new Date(
            ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
          );

          const timeToExpiration = calculateTimeToExpiration('Porta');
          const proximaInspecao = timeToExpiration && addDays(ultimaInspecao, timeToExpiration);

          return {
            ...valve,
            predio: valve?.Predio ?? '-',
            pavimento: valve?.Pavimento ?? '-',
            local: valve?.LocEsp ?? '-',
            ultima_inspecao: ultimaInspecao,
            proximaInspecao: proximaInspecao,
          };
        }

        if (params.id && equipmentModal === 'Alarme') {
          const valve = await fechMiscellaneousEquipmentData(params.id);
          const ultimaInspecaoIsoDate = parseISO(valve.ultimaInsp);

          const ultimaInspecao = new Date(
            ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
          );

          const timeToExpiration = calculateTimeToExpiration('Alarme');
          const proximaInspecao = timeToExpiration && addDays(ultimaInspecao, timeToExpiration);

          return {
            ...valve,
            predio: valve?.Predio ?? '-',
            pavimento: valve?.Pavimento ?? '-',
            local: valve?.LocEsp ?? '-',
            ultima_inspecao: ultimaInspecao,
            proximaInspecao: proximaInspecao,
          };
        }

        if (params.id && equipmentModal === 'Ambulancia') {
          const valve = await fechMiscellaneousEquipmentData(params.id);
          const ultimaInspecaoIsoDate = parseISO(valve.ultimaInsp);

          const ultimaInspecao = new Date(
            ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
          );

          const timeToExpiration = calculateTimeToExpiration('Ambulancia');
          const proximaInspecao = timeToExpiration && addDays(ultimaInspecao, timeToExpiration);

          return {
            ...valve,
            predio: valve?.Predio ?? '-',
            pavimento: valve?.Pavimento ?? '-',
            local: valve?.LocEsp ?? '-',
            ultima_inspecao: ultimaInspecao,
            proximaInspecao: proximaInspecao,
          };
        }

        if (params.id && equipmentModal === 'Hidrante') {
          const valve = await fechHydrantData(params.id);
          const ultimaInspecaoIsoDate = parseISO(valve.ultimaInsp);

          const ultimaInspecao = new Date(
            ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
          );

          const timeToExpiration = calculateTimeToExpiration('Hidrante');
          const proximaInspecao = timeToExpiration && addDays(ultimaInspecao, timeToExpiration);

          return {
            ...valve,
            predio: valve?.Predio ?? '-',
            pavimento: valve?.Pavimento ?? '-',
            local: valve?.LocEsp ?? '-',
            ultima_inspecao: ultimaInspecao,
            proximaInspecao: proximaInspecao,
          };
        }

        return [];
      },
      staleTime: 5000 * 60, // 5 Minute
      refetchOnWindowFocus: false,
      enabled: params.id !== undefined && equipmentModal !== null,
    });

  return {
    getDaysInMonth,
    dateSelected,
    setDateSected,
    monthsList,
    selectedMonth,
    setSelectedMonth,

    nextMonth,
    prevMonth,
    weeks,
    selectedYear,
    setSelectedYear,
    generateDateList,

    dataEquipments,
    isLoadingDataEquipments,

    dataEquipmentsModal,
    isLoadingDataEquipmentsModal,
  };
};
