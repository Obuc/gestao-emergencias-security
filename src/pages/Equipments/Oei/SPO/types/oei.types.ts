export interface OeiProps {
  Id: number;
  Predio: string;
  Title: string;
  LocEsp: string;

  Conforme: boolean;
}

export interface OeiModalProps {
  Id: number;
  Predio: string;
  Title: string;
  LocEsp: string;
}

export interface OeiHistoryProps {
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

export interface OeiFiltersProps {
  Id: string | null;
  Predio: string | null;
  LocEsp: string | null;
  numero_etiqueta: string | null;
  Conforme: { value: string; label: string } | null;
}
