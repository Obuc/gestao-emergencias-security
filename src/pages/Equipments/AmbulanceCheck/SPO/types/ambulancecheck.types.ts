export interface AmbulanceCheckProps {
  Id: number;
  Title: string;
  Conforme: boolean;
}

export interface AmbulanceCheckModalProps {
  Id: number;
  Title: string;
}

export interface AmbulanceCheckHistoryProps {
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

export interface AmbulanceCheckFiltersProps {
  Id: string | null;
  numero_etiqueta: string | null;
  Conforme: { value: string; label: string } | null;
}
