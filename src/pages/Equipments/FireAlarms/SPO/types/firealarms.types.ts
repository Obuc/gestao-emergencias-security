export interface FireAlarmsProps {
  Id: number;
  Predio: string;
  Title: string;
  Conforme: boolean;
}

interface FireAlarmsHistoryProps {
  Id: number;
  Created: Date;
  tipo: string;
  idEquipamento: number;
  responsavel: string;
  item: string;
  idRegistro: number;
  novoCodigo: string;
  novaValidade: Date;
}

export interface FireAlarmsModalProps {
  Id: number;
  Predio: string;
  Title: string;

  history: Array<FireAlarmsHistoryProps>;
}

export interface FireAlarmsFiltersProps {
  Id: string | null;
  Predio: string | null;
  numero_etiqueta: string | null;
  Conforme: { value: string; label: string } | null;
}
