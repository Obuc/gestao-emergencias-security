export interface SpillKitProps {
  Id: number;
  Predio: string;
  Pavimento: string;
  Title: string;
  Conforme: boolean;
  LocEsp?: string
}

export interface SpillKitModalProps {
  Id: number;
  Predio: string;
  Pavimento: string;
  Title: string;
}

export interface SpillKitHistoryProps {
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

export interface SpillKitFiltersProps {
  Id: string | null;
  Predio: string | null;
  Pavimento: string | null;
  numero_etiqueta: string | null;
  Conforme: { value: string; label: string } | null;
}
