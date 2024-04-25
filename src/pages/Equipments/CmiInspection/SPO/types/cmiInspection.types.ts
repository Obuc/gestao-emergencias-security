export interface CmiInspectionProps {
  Id: number;
  Predio: string;
  Title: string;
  Conforme: boolean;
}

export interface CmiInspectionModalProps {
  Id: number;
  Predio: string;
  Title: string;
}

export interface CmiInspectionHistoryProps {
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

export interface CmiInspectionFiltersProps {
  Id: string | null;
  Predio: string | null;
  numero_etiqueta: string | null;
  Conforme: { value: string; label: string } | null;
}
