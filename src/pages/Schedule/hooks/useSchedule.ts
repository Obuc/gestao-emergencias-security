import { useState } from 'react';
import { parseISO } from 'date-fns';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { DataEquipments } from '../types/DataEquipments';
import { sharepointContext } from '../../../context/sharepointContext';

export const useSchedule = () => {
  const { crud } = sharepointContext();

  const [dateSelected, setDateSected] = useState<Date | null>(null);
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

  // Requests
  const calculateTimeToExpiration = (type: string) => {
    switch (type) {
      case 'Extintor':
        return 30;

      case 'Válvulas de Governo':
        return 90;

      case 'Inspeção CMI':
        return 30;

      case 'Teste CMI':
        return 30;

      default:
        0; // Valor padrão para tipos desconhecidos ou não especificados
    }
  };

  const fetchExtinguisher = async () => {
    // const startDate = new Date(selectedYear, selectedMonth, 1);
    // const endDate = new Date(selectedYear, selectedMonth + 1, 0);
    // const formattedStartDate = `${startDate.toISOString().split('T')[0]}T00:00:00Z`;
    // const formattedEndDate = `${endDate.toISOString().split('T')[0]}T00:00:00Z`;
    // const filterString = `ultima_inspecao ge datetime'${formattedStartDate}' and ultima_inspecao le datetime'${formattedEndDate}'`;

    // const path = `?$Select=Id,excluido,cod_extintor,cod_qrcode,conforme,local/Title,massa/Title,pavimento/Title,predio/Title,site/Title,tipo_extintor/Title,validade,ultima_inspecao&$expand=local,massa,pavimento,predio,site,tipo_extintor&$Filter=(excluido eq 'false' and ultima_inspecao ne null)`;

    const path = `?$Select=Id,excluido,validade,ultima_inspecao&$Filter=(excluido eq 'false' and ultima_inspecao ne null)`;

    const resp = await crud.getListItemsv2('extintores', path);
    return resp.results;
  };

  const fetchMiscellaneousEquipment = async () => {
    // const startDate = new Date(selectedYear, selectedMonth, 1);
    // const endDate = new Date(selectedYear, selectedMonth + 1, 0);
    // const formattedStartDate = `${startDate.toISOString().split('T')[0]}T00:00:00Z`;
    // const formattedEndDate = `${endDate.toISOString().split('T')[0]}T00:00:00Z`;

    // const filterString = `ultima_inspecao ge datetime'${formattedStartDate}' and ultima_inspecao le datetime'${formattedEndDate}'`;

    const path = `?$Select=Id,cod_qrcode,site/Title,predio/Title,pavimento/Title,local/Title,tipo_equipamento/Title,cod_equipamento,ultima_inspecao,conforme,excluido&$expand=site,predio,pavimento,local,tipo_equipamento &$Filter=(excluido eq 'false' and ultima_inspecao ne null)`;

    const resp = await crud.getListItemsv2('equipamentos_diversos', path);
    return resp.results;
  };

  const { data: dataEquipments, isLoading: isLoadingDataEquipments }: UseQueryResult<Array<DataEquipments>> = useQuery({
    queryKey: ['eq_extinguisher_data_modal'],
    queryFn: async () => {
      const extinguiserData = await fetchExtinguisher();
      const miscellaneousEquipmentData = await fetchMiscellaneousEquipment();

      const formattedExtinguisherData = extinguiserData.map((extinguisher: any) => {
        const ultimaInspecaoIsoDate = parseISO(extinguisher.ultima_inspecao);

        const ultimaInspecao = new Date(
          ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
        );
        const timeToExpiration = calculateTimeToExpiration('Extintor');
        const proximaInspecao =
          timeToExpiration && new Date(ultimaInspecao.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);

        return {
          type: 'Extintor',
          Id: extinguisher.Id,
          ultima_inspecao: ultimaInspecao,
          proxima_inspecao: proximaInspecao,
        };
      });

      const formattedMiscellaneousEquipmentData = miscellaneousEquipmentData.map((equipment: any) => {
        const ultimaInspecaoIsoDate = parseISO(equipment.ultima_inspecao);

        const ultimaInspecao = new Date(
          ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
        );
        const timeToExpiration = calculateTimeToExpiration(equipment.tipo_equipamento.Title);
        const proximaInspecao =
          timeToExpiration && new Date(ultimaInspecao.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);

        return {
          type: equipment.tipo_equipamento.Title,
          Id: equipment.Id,
          ultima_inspecao: ultimaInspecao,
          proxima_inspecao: proximaInspecao,
        };
      });

      const combinedData = [...formattedExtinguisherData, ...formattedMiscellaneousEquipmentData];

      return combinedData;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
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
  };
};
