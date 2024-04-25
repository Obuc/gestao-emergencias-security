export interface DeaProps {
  Id: number;
  Title: string;
  Predio: string;
  Codigo: string;
  LocEsp: string;
  Conforme: boolean;
}

interface DeaHistoryProps {
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

export interface DeaModalProps {
  Id: number;
  Title: string;
  Predio: string;
  Codigo: string;
  LocEsp: string;

  history: Array<DeaHistoryProps>;
}

export interface DeaFiltersProps {
  Id: string | null;
  numero_etiqueta: string | null;
  Predio: string | null;
  Codigo: string | null;
  LocEsp: string | null;
  Conforme: { value: string; label: string } | null;
}
