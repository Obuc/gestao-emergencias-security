export interface SpillKit {
  Id: number;
  Created: Date;
  Responsavel?: string;
  Local: string;

  Sin: boolean;
  Obs: boolean;
  Lacre: boolean;
  Compl: boolean;
  Validade: boolean;

  conforme: boolean;
}

export interface SpillKitModal {
  Id: number;
  Created: Date;
  Responsavel?: string;

  Sin: boolean;
  Obs: boolean;
  Lacre: boolean;
  Compl: boolean;
  Validade: boolean;

  Observacao?: string;
  UF: string;
  Municipios: string;
  Site: string;
  Local: string;
  Area: string;
}

export interface ISpillKitFiltersProps {
  responsible: string | null;
  id: string | null;
  place: string | null;
  startDate: Date | null;
  endDate: Date | null;
  conformity: string | null;
}
