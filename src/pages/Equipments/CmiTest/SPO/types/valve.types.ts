export interface ValveProps {
  Id: number;
  Codigo: string;
  Predio: string;
  LocEsp?: string;
  Title: string;
  Conforme: boolean;
}

interface ValveHistoryProps {
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

export interface ValveModalProps {
  Id: number;
  Codigo: string;
  Predio: string;
  LocEsp?: string;
  Title: string;

  history: Array<ValveHistoryProps>;
}

export interface ValveFiltersProps {
  Id: string | null;
  Codigo: string | null;
  Predio: string | null;
  LocEsp: string | null;
  numero_etiqueta: string | null;
  Conforme: { value: string; label: string } | null;
}
