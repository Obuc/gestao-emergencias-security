export interface Dea {
  Id: number;
  Responsavel?: string;
  CodDea?: string;
  Site: string;
  Area: string;
  Local: string;
  Created: Date;
  Sin: boolean;
  Int: boolean;
  Obst: boolean;
  Clb: boolean;
  Val: boolean;
  Pas: boolean;
  conforme: boolean;
}

export interface DeaModal {
  Id: number;
  Responsavel?: string;
  CodDea?: string;
  Site: string;
  Area: string;
  Created: Date;

  Sin: boolean;
  Int: boolean;
  Obst: boolean;
  Clb: boolean;
  Val: boolean;
  Pas: boolean;

  Obs?: string;
  UF: string;
  Municipios: string;
  Local: string;
  LocEsp: string;
}

export interface DeaFilters {
  responsible: string | null;
  cod: string | null;
  id: string | null;
  place: string | null;
  startDate: Date | null;
  endDate: Date | null;
  conformity: string | null;
}
