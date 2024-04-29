export interface Oei {
  Id: number;
  Responsavel1?: string;
  Local: string;
  Elevador: string;
  Created: Date;

  OData__x004c_oc1: boolean;
  OData__x0046_cn1: boolean;
  OData__x0046_cn2: boolean;
  OData__x0046_cn3: boolean;
  OData__x0046_cn4: boolean;
  OData__x0049_nt1: boolean;
  OData__x0049_nt2: boolean;

  conforme: boolean;
}

export interface OeiModal {
  Id: number;
  Created: Date;
  Responsavel1?: string;
  UF: string;
  Municipios: string;
  Site: string;
  Area: string;
  Local: string;

  OData__x004c_oc1: boolean;
  OData__x0046_cn1: boolean;
  OData__x0046_cn2: boolean;
  OData__x0046_cn3: boolean;
  OData__x0046_cn4: boolean;
  OData__x0049_nt1: boolean;
  OData__x0049_nt2: boolean;

  Observacao?: string;
}

export interface OeiFilters {
  responsible: string | null;
  id: string | null;
  place: string | null;
  startDate: Date | null;
  endDate: Date | null;
  conformity: string | null;
}
