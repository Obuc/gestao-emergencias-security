import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { addDays, differenceInDays, parseISO } from 'date-fns';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { DataEquipments, DataEquipmentsModal } from '../types/schedule';

export const useSchedule = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const equipmentModal = searchParams.get('equipment');
  const user_site = localStorage.getItem('user_site');

  const isMiscellaneousEquipment =
    equipmentModal === 'Inspeção CMI' || equipmentModal === 'Teste CMI' || equipmentModal === 'Válvulas de Governo';

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

      case 'Válvulas de Governo':
        return 90;

      case 'Inspeção CMI':
        return 7;

      case 'Teste CMI':
        return 7;

      case 'Hidrantes':
        return 30;

      case 'Checklist Geral':
        return 15;

      case 'Relação Carga':
        return 15;

      default:
        0;
    }
  };

  const fetchExtinguisher = async () => {
    const path = `?$Select=Id,excluido,validade,ultima_inspecao,data_inspecao_base,site/Title&$expand=site&$Filter=(excluido eq 'false' and ultima_inspecao ne null and site/Title eq '${user_site}')`;
    const resp = await crud.getListItemsv2('extintores', path);

    const data = resp.results.map((extinguisher: any) => {
      const ultimaInspecaoIsoDate = parseISO(extinguisher.ultima_inspecao);
      const dataInspecaoBase = parseISO(extinguisher.data_inspecao_base);

      const ultimaInspecao = new Date(ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000);

      const inspecaoBase = new Date(dataInspecaoBase.getTime() + dataInspecaoBase.getTimezoneOffset() * 60000);

      const timeToExpiration = calculateTimeToExpiration('Extintor');

      const dates = [];
      let nextInspection = inspecaoBase;

      for (let i = 0; i < 10; i++) {
        if (timeToExpiration) {
          nextInspection = new Date(nextInspection.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);

          const diffInDays = differenceInDays(ultimaInspecao, inspecaoBase);
          const realizadaForaDoPrazo = diffInDays > 0;

          dates.push({
            type: 'Extintor',
            Id: extinguisher.Id,
            ultima_inspecao: ultimaInspecao,
            proxima_inspecao: nextInspection,
            frequencia: timeToExpiration,
            realizada_fora_do_prazo: realizadaForaDoPrazo,
            deveria_ser_realizada: inspecaoBase,
          });
        }
      }

      return dates;
    });

    const combinedData = data.reduce((acc: any, curr: any) => acc.concat(curr), []);
    return combinedData;
  };

  const fetchMiscellaneousEquipment = async () => {
    const path = `?$Select=Id,site/Title,tipo_equipamento/Title,ultima_inspecao,excluido&$expand=site,tipo_equipamento&$Filter=(excluido eq 'false' and ultima_inspecao ne null and site/Title eq '${user_site}')`;
    const resp = await crud.getListItemsv2('equipamentos_diversos', path);

    const data = resp.results.map((equipment: any) => {
      const ultimaInspecaoIsoDate = parseISO(equipment.ultima_inspecao);
      const ultimaInspecao = new Date(ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000);
      const timeToExpiration = calculateTimeToExpiration(equipment.tipo_equipamento.Title);

      const dates = [];
      let nextInspection = ultimaInspecao;

      for (let i = 0; i < 10; i++) {
        if (timeToExpiration) {
          nextInspection = new Date(nextInspection.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);
          dates.push({
            type: equipment.tipo_equipamento.Title,
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

  const fetchHydrants = async () => {
    const path = `?$Select=Id,site/Title,ultima_inspecao,excluido&$expand=site&$Filter=(excluido eq 'false' and ultima_inspecao ne null and site/Title eq '${user_site}')`;
    const resp = await crud.getListItemsv2('hidrantes', path);

    const data = resp.results.map((equipment: any) => {
      const ultimaInspecaoIsoDate = parseISO(equipment.ultima_inspecao);
      const ultimaInspecao = new Date(ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000);
      const timeToExpiration = calculateTimeToExpiration('Hidrantes');

      const dates = [];
      let nextInspection = ultimaInspecao;

      for (let i = 0; i < 10; i++) {
        if (timeToExpiration) {
          nextInspection = new Date(nextInspection.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);
          dates.push({
            type: 'Hidrantes',
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

  const fetchVehicles = async () => {
    const path = `?$Select=Id,site/Title,ultima_inspecao,ultima_inspecao_relacao_carga,excluido,tipo_veiculo/Title&$expand=site,tipo_veiculo&$Filter=(excluido eq 'false' and site/Title eq '${user_site}')`;
    const resp = await crud.getListItemsv2('veiculos_emergencia', path);

    const data = resp.results.map((equipment: any) => {
      if (equipment.ultima_inspecao) {
        const ultimaInspecaoIsoDate = parseISO(equipment.ultima_inspecao);
        const ultimaInspecao = new Date(
          ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
        );
        const timeToExpiration = calculateTimeToExpiration('Checklist Geral');

        const dates = [];
        let nextInspection = ultimaInspecao;

        for (let i = 0; i < 10; i++) {
          if (timeToExpiration) {
            nextInspection = new Date(nextInspection.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);
            dates.push({
              type: `Checklist Geral - ${equipment?.tipo_veiculo?.Title}`,
              Id: equipment.Id,
              ultima_inspecao: ultimaInspecao,
              proxima_inspecao: nextInspection,
            });
          }
        }

        return dates;
      } else if (equipment.ultima_inspecao_relacao_carga) {
        const ultimaInspecaoIsoDate = parseISO(equipment.ultima_inspecao_relacao_carga);
        const ultimaInspecao = new Date(
          ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
        );
        const timeToExpiration = calculateTimeToExpiration('Relação Carga');

        const dates = [];
        let nextInspection = ultimaInspecao;

        for (let i = 0; i < 10; i++) {
          if (timeToExpiration) {
            nextInspection = new Date(nextInspection.getTime() + timeToExpiration * 24 * 60 * 60 * 1000);
            dates.push({
              type: `Relação Carga - ${equipment?.tipo_veiculo?.Title}`,
              Id: equipment.Id,
              ultima_inspecao: ultimaInspecao,
              proxima_inspecao: nextInspection,
            });
          }
        }

        return dates;
      } else {
        return [];
      }
    });

    const combinedData = data.reduce((acc: any, curr: any) => acc.concat(curr), []);
    return combinedData;
  };

  const { data: dataEquipments, isLoading: isLoadingDataEquipments }: UseQueryResult<Array<DataEquipments>> = useQuery({
    queryKey: ['dataEquipments_schedule'],
    queryFn: async () => {
      const extinguiserData = await fetchExtinguisher();
      const miscellaneousEquipmentData = await fetchMiscellaneousEquipment();
      const hydrantsData = await fetchHydrants();
      const vehiclesData = await fetchVehicles();

      const combinedData = [...extinguiserData, ...miscellaneousEquipmentData, ...hydrantsData, ...vehiclesData];
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
      `?$Select=Id,predio/Title,pavimento/Title,local/Title,tipo_equipamento/Title,ultima_inspecao&$expand=tipo_equipamento,predio,pavimento,local&$Filter=(Id eq '${equipmentId}')`,
    );
    return resp.results[0];
  };

  const fechHydrant = async (equipmentId: string) => {
    const resp = await crud.getListItemsv2(
      'hidrantes',
      `?$Select=Id,predio/Title,pavimento/Title,local/Title,ultima_inspecao&$expand=predio,pavimento,local&$Filter=(Id eq '${equipmentId}')`,
    );
    return resp.results[0];
  };

  const fechVehicle = async (equipmentId: string) => {
    const resp = await crud.getListItemsv2(
      'veiculos_emergencia',
      `?$Select=Id,tipo_veiculo/Title,placa,ultima_inspecao,ultima_inspecao_relacao_carga&$expand=tipo_veiculo&$Filter=(Id eq '${equipmentId}')`,
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

          const timeToExpiration = calculateTimeToExpiration('Extintor');
          const proximaInspecao = timeToExpiration && addDays(ultimaInspecao, timeToExpiration);

          return {
            ...extinguisher,
            predio: extinguisher?.predio?.Title,
            pavimento: extinguisher?.pavimento?.Title,
            local: extinguisher?.local?.Title,
            ultima_inspecao: ultimaInspecao,
            proximaInspecao: proximaInspecao,
          };
        }

        if (params.id && isMiscellaneousEquipment) {
          const miscellaneousEquipment = await fechMiscellaneousEquipment(params.id);

          const ultimaInspecaoIsoDate = parseISO(miscellaneousEquipment.ultima_inspecao);

          const ultimaInspecao = new Date(
            ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
          );

          const timeToExpiration = calculateTimeToExpiration(miscellaneousEquipment?.tipo_equipamento?.Title);
          const proximaInspecao = timeToExpiration && addDays(ultimaInspecao, timeToExpiration);

          return {
            ...miscellaneousEquipment,
            predio: miscellaneousEquipment?.predio?.Title,
            pavimento: miscellaneousEquipment?.pavimento?.Title,
            local: miscellaneousEquipment?.local?.Title,
            ultima_inspecao: ultimaInspecao,
            proximaInspecao: proximaInspecao,
          };
        }

        if (params.id && equipmentModal === 'Hidrantes') {
          const hydrant = await fechHydrant(params.id);
          const ultimaInspecaoIsoDate = parseISO(hydrant.ultima_inspecao);

          const ultimaInspecao = new Date(
            ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
          );

          return {
            ...hydrant,
            predio: hydrant?.predio?.Title,
            pavimento: hydrant?.pavimento?.Title,
            local: hydrant?.local?.Title,
            ultima_inspecao: ultimaInspecao,
          };
        }

        if (params.id && equipmentModal?.includes('Checklist Geral')) {
          const generalChecklist = await fechVehicle(params.id);

          if (generalChecklist.ultima_inspecao) {
            const ultimaInspecaoIsoDate = parseISO(generalChecklist.ultima_inspecao);

            const ultimaInspecao = new Date(
              ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
            );

            return {
              ...generalChecklist,
              tipo_veiculo: generalChecklist?.tipo_veiculo?.Title,
              placa: generalChecklist?.placa,
              ultima_inspecao: ultimaInspecao,
            };
          } else {
            return {};
          }
        }

        if (params.id && equipmentModal?.includes('Relação Carga')) {
          const generalChecklist = await fechVehicle(params.id);

          if (generalChecklist.ultima_inspecao_relacao_carga) {
            const ultimaInspecaoIsoDate = parseISO(generalChecklist.ultima_inspecao_relacao_carga);

            const ultimaInspecao = new Date(
              ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000,
            );

            return {
              ...generalChecklist,
              tipo_veiculo: generalChecklist?.tipo_veiculo?.Title,
              placa: generalChecklist?.placa,
              ultima_inspecao: ultimaInspecao,
            };
          } else {
            return {};
          }
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
