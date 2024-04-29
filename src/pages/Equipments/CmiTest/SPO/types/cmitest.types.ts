export interface CmiTestProps {
  Id: number;
  Predio: string;
  Title: string;
  Conforme: boolean;
}

export interface CmiTestModalProps {
  Id: number;
  Predio: string;
  Title: string;
}

export interface CmiTestHistoryProps {
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

export interface CmiTestFiltersProps {
  Id: string | null;
  Predio: string | null;
  numero_etiqueta: string | null;
  Conforme: { value: string; label: string } | null;
}
