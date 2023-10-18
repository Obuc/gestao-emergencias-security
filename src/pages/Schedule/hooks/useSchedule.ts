import { useState } from 'react';
import { parseISO } from 'date-fns';
import { useParams, useSearchParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { DataEquipments, DataEquipmentsModal } from '../types/DataEquipments';
import { sharepointContext } from '../../../context/sharepointContext';

export const useSchedule = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const equipmentModal = searchParams.get('equipment');
  const isMiscellaneousEquipment =
    equipmentModal === 'Inspeção CMI' || equipmentModal === 'Teste CMI' || equipmentModal === 'Válvulas de Governo';

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
    const path = `?$Select=Id,excluido,validade,ultima_inspecao&$Filter=(excluido eq 'false' and ultima_inspecao ne null)`;
    const resp = await crud.getListItemsv2('extintores', path);
    return resp.results;
  };

  const fetchMiscellaneousEquipment = async () => {
    const path = `?$Select=Id,cod_qrcode,site/Title,predio/Title,pavimento/Title,local/Title,tipo_equipamento/Title,cod_equipamento,ultima_inspecao,conforme,excluido&$expand=site,predio,pavimento,local,tipo_equipamento &$Filter=(excluido eq 'false' and ultima_inspecao ne null)`;

    const resp = await crud.getListItemsv2('equipamentos_diversos', path);
    return resp.results;
  };

  const { data: dataEquipments, isLoading: isLoadingDataEquipments }: UseQueryResult<Array<DataEquipments>> = useQuery({
    queryKey: ['dataEquipments_schedule'],
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

  const fechExtinguisherData = async (extinguisherId: string) => {
    const resp = await crud.getListItemsv2(
      'extintores',
      `?$Select=Id,predio/Title,pavimento/Title,local/Title,ultima_inspecao&$expand=predio,pavimento,local&$Filter=(Id eq '${extinguisherId}')`,
    );
    return resp.results[0];
  };

  const fechMiscellaneousEquipment = async (equipmentId: string) => {
    const resp = await crud.getListItemsv2(
      'equipamentos_diversos',
      `?$Select=Id,predio/Title,pavimento/Title,local/Title,ultima_inspecao&$expand=predio,pavimento,local&$Filter=(Id eq '${equipmentId}')`,
    );
    return resp.results[0];
  };

  const { data: dataEquipmentsModal, isLoading: isLoadingDataEquipmentsModal }: UseQueryResult<DataEquipmentsModal> =
    useQuery({
      queryKey:
        params.id !== undefined && equipmentModal !== null
          ? ['dataEquipments_schedule_modal', params.id, equipmentModal]
          : ['dataEquipments_schedule_modal'],
      queryFn: async () => {
        if (params.id && equipmentModal === 'Extintor') {
          const extinguisher = await fechExtinguisherData(params.id);
          const ultimaInspecaoIsoDate = parseISO(extinguisher.ultima_inspecao);

          const ultimaInspecao = new Date(
            ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
          );

          return {
            ...extinguisher,
            predio: extinguisher?.predio?.Title,
            pavimento: extinguisher?.pavimento?.Title,
            local: extinguisher?.local?.Title,
            ultima_inspecao: ultimaInspecao,
          };
        }

        if (params.id && isMiscellaneousEquipment) {
          const miscellaneousEquipment = await fechMiscellaneousEquipment(params.id);

          const ultimaInspecaoIsoDate = parseISO(miscellaneousEquipment.ultima_inspecao);

          const ultimaInspecao = new Date(
            ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
          );

          return {
            ...miscellaneousEquipment,
            predio: miscellaneousEquipment?.predio?.Title,
            pavimento: miscellaneousEquipment?.pavimento?.Title,
            local: miscellaneousEquipment?.local?.Title,
            ultima_inspecao: ultimaInspecao,
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
