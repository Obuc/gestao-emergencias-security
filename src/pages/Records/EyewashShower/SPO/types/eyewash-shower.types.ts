export interface EyewashShower {
  Id: number;
  Created: Date;
  Responsavel?: string;
  Local: string;

  Sin: boolean;
  Obs: boolean;
  Insp: boolean;
  Press: boolean;
  Agua: boolean;

  conforme: boolean;
}

export interface EyewashShowerModal {
  Id: number;
  Created: Date;
  Responsavel?: string;

  Sin: boolean;
  Obs: boolean;
  Insp: boolean;
  Press: boolean;
  Agua: boolean;

  Observacao?: string;
  UF: string;
  Municipios: string;
  Site: string;
  Local: string;
  Area: string;
}

export interface IEyewashShowerFiltersProps {
  responsible: string | null;
  id: string | null;
  place: string | null;
  startDate: Date | null;
  endDate: Date | null;
  conformity: string | null;
}
