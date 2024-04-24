export interface EmergencyDoorsProps {
  Id: number;
  Predio: string;
  Pavimento: string;
  Title: string;

  Conforme: boolean;
}

interface EmergencyDoorsHistoryProps {
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

export interface EmergencyDoorsModalProps {
  Id: number;
  Predio: string;
  Tipo: string;
  Pavimento: string;
  Title: string;

  history: Array<EmergencyDoorsHistoryProps>;
}

export interface EmergencyDoorsFiltersProps {
  Id: string | null;
  Predio: string | null;
  Pavimento: string | null;
  numero_etiqueta: string | null;
  Conforme: { value: string; label: string } | null;
}
