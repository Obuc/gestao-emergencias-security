export interface HydrantsProps {
  Id: number;
  Title: string; // Código do local
  numero_hidrante?: string;
  ultimaInsp: Date;
  NumMangueiras: string;
  NumLacre: string;
  Predio: string;
  Pavimento: string;
  LocEsp: string;
  Conforme: boolean;
}

interface HydrantsHistoryProps {
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

export interface HydrantsModalProps {
  Id: number;
  Title: string; // Código do local
  numero_hidrante?: string;
  ultimaInsp: Date;
  NumMangueiras: string;
  NumLacre: string;
  Predio: string;
  Pavimento: string;
  LocEsp: string;
  Conforme: boolean;
  diametro?: string;
  comprimento?: string;

  history: Array<HydrantsHistoryProps>;
}

export interface HydrantsFiltersProps {
  id: string | null;
  numero_hidrante: string | null;
  predio: string | null;
  pavimento: string | null;
  local: string | null;
  conforme: { value: string; label: string } | null;
  cod_local: string | null;
}
