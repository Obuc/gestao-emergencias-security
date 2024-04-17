export interface AmbulanceCheck {
  Id: number;
  Responsavel1?: string;
  Site: string;
  Created: Date;

  OData__x0056_er1: boolean;
  OData__x0056_er2: boolean;
  OData__x0056_er3: boolean;
  OData__x0056_er4: boolean;
  OData__x0056_er5: boolean;
  OData__x0056_er6: boolean;
  OData__x0056_er7: boolean;
  OData__x0056_er8: boolean;
  OData__x0056_er9: boolean;
  OData__x0056_er10: boolean;
  OData__x0056_er11: boolean;

  conforme: boolean;
}

export interface AmbulanceCheckModal {
  Id: number;
  Created: Date;
  Responsavel1?: string;
  UF: string;
  Municipios: string;
  Site: string;

  OData__x0056_er1: boolean;
  OData__x0056_er2: boolean;
  OData__x0056_er3: boolean;
  OData__x0056_er4: boolean;
  OData__x0056_er5: boolean;
  OData__x0056_er6: boolean;
  OData__x0056_er7: boolean;
  OData__x0056_er8: boolean;
  OData__x0056_er9: boolean;
  OData__x0056_er10: boolean;
  OData__x0056_er11: boolean;
  Observacao?: string;
}

export interface AmbulanceCheckFilters {
  responsible: string | null;
  id: string | null;
  startDate: Date | null;
  endDate: Date | null;
  conformity: string | null;
}
