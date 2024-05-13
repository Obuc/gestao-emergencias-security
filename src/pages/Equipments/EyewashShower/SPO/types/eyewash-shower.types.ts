export interface EyewashShowerProps {
  Id: number;
  Predio: string;
  Pavimento: string;
  Title: string;
  Conforme: boolean;
}

export interface EyewashShowerModalProps {
  Id: number;
  Predio: string;
  Pavimento: string;
  Title: string;
}

export interface EyewashShowerHistoryProps {
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

export interface EyewashShowerFiltersProps {
  Id: string | null;
  Predio: string | null;
  Pavimento: string | null;
  numero_etiqueta: string | null;
  Conforme: { value: string; label: string } | null;
}
