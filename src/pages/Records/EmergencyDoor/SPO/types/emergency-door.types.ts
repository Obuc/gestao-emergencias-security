export interface EmergencyDoor {
  Id: number;
  Responsavel1?: string;
  Local: string;
  LocalEsp: string;
  Created: Date;
  Obst: boolean;
  Func: boolean;
  Reparo: boolean;
  Abertura: boolean;

  conforme: boolean;
}

export interface EmergencyDoorModal {
  Id: number;
  Created: Date;
  Responsavel1?: string;
  UF: string;
  Municipios: string;
  Site: string;
  Area: string;
  Local: string;
  LocalEsp: string;
  Obst: boolean;
  Func: boolean;
  Reparo: boolean;
  Abertura: boolean;
  Observacao?: string;
}

export interface EmergencyDoorFilters {
  responsible: string | null;
  id: string | null;
  place: string | null;
  startDate: Date | null;
  endDate: Date | null;
  conformity: string | null;
}
