export interface ExtinguisherProps {
  Id: number;
  codExtintor: string;
  Predio: string;
  Pavimento: string;
  LocEsp: string;
  Tipo: string;
  Conforme: boolean;
  Title: string; // Código do local
}

export interface ExtinguisherModalProps {
  Id: number;
  Title: string; // Código do local
  codExtintor: string;
  validadeExtintor: Date;
  Predio: string;
  Pavimento: string;
  LocEsp: string;
  Tipo: string;
  peso_extintor?: string;
}

export interface ExtinguisherHistoryModalProps {
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

export interface ExtinguisherFiltersProps {
  id: string | null;
  codExtintor: string | null;
  predio: string | null;
  pavimento: string | null;
  local: string | null;
  tipo: string | null;
  conforme: { value: string; label: string } | null;
  cod_local: string | null;
}
