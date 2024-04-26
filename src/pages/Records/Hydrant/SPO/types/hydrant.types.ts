export interface Hydrant {
  Id: number;
  Created: Date;
  Responsavel1?: string;
  Title: string;
  CodLacre?: string;
  CodMangueira?: string;
  Local: string;
  Pavimento: string;
  LocalEsp: string;
  OData__x0048_id1: boolean;
  OData__x0048_id2: boolean;
  OData__x0041_bg1: boolean;
  OData__x0041_bg2: boolean;
  OData__x0053_nl1: boolean;
  OData__x0053_nl2: boolean;
  Obst1: boolean;
  Obst2: boolean;
  OData__x004c_cr1: boolean;
  OData__x004c_cr2: boolean;
  OData_Insp1: boolean;
  OData_Insp2: boolean;

  conforme: boolean;
}

export interface HydrantModal {
  Id: number;
  Created: Date | null;
  Responsavel1?: string;
  Title: string;
  CodLacre?: string;
  CodMangueira?: string;
  Local: string;
  Pavimento: string;
  LocalEsp: string;
  OData__x0048_id1: boolean;
  OData__x0048_id2: boolean;
  OData__x0041_bg1: boolean;
  OData__x0041_bg2: boolean;
  OData__x0053_nl1: boolean;
  OData__x0053_nl2: boolean;
  Obst1: boolean;
  Obst2: boolean;
  OData__x004c_cr1: boolean;
  OData__x004c_cr2: boolean;
  Insp1: boolean;
  Insp2: boolean;
  UF: string;
  Municipios: string;
  Site: string;
  Area: string;
  Diametro?: string;
  Comprimento?: string;
  codigo: string;
  Observacao?: string;
}

export interface IHydrantFiltersProps {
  responsible: string | null;
  hydrantId: string | null;
  startDate: Date | null;
  endDate: Date | null;
  seal: string | null;
  hoses: string | null;
  place: string | null;
  pavement: string | null;
  specificLocation: string | null;
  conformity: string | null;
}
