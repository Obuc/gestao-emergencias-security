export interface ValveProps {
  Id: number;
  Codigo: string;
  Predio: string;
  LocEsp?: string;
  Title: string;
  Conforme: boolean;
}

export interface ValveModalProps {
  Id: number;
  Codigo: string;
  Predio: string;
  LocEsp?: string;
  Title: string;
}
export interface ValveHistoryProps {
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

export interface ValveFiltersProps {
  Id: string | null;
  Codigo: string | null;
  Predio: string | null;
  LocEsp: string | null;
  numero_etiqueta: string | null;
  Conforme: { value: string; label: string } | null;
}
