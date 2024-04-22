export interface Alarms {
  Id: number;
  Responsavel1?: string;
  Local: string;
  Created: Date;
  Sirene: boolean;
  Luminoso: boolean;
  conforme: boolean;
}

export interface AlarmsModal {
  Id: number;
  Created: Date;
  Responsavel1?: string;
  UF: string;
  Municipios: string;
  Site: string;
  Area: string;
  Local: string;
  Sirene: boolean;
  Luminoso: boolean;
  Observacao?: string;
}

export interface AlarmsFilters {
  responsible: string | null;
  id: string | null;
  place: string | null;
  startDate: Date | null;
  endDate: Date | null;
  conformity: string | null;
}
