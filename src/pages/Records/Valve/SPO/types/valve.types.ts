export interface GovernanceValve {
  Id: number;
  Created: Date;
  Responsavel1?: string;
  Local: string;
  OData__x0054_mp1: boolean;
  OData__x0054_mp2: boolean;
  OData__x0046_cn1: boolean;
  OData__x0046_cn2: boolean;
  OData__x0046_cn3: boolean;
  OData__x0046_cn4: boolean;
  OData__x0053_in1: boolean;
  OData__x004c_cr1: boolean;
  OData__x004c_cr2: boolean;
  OData__x004f_bs1: boolean;
  Obst2: boolean;
  conforme: boolean;
}

export interface GovernanceValveModal {
  Id: number;
  Created: Date | null;
  Responsavel1?: string;
  OData__x0054_mp1: boolean;
  OData__x0054_mp2: boolean;
  OData__x0046_cn1: boolean;
  OData__x0046_cn2: boolean;
  OData__x0046_cn3: boolean;
  OData__x0046_cn4: boolean;
  OData__x0053_in1: boolean;
  OData__x004c_cr1: boolean;
  OData__x004c_cr2: boolean;
  OData__x004f_bs1: boolean;
  Obst2: boolean;
  Observacao?: string;
  UF: string;
  Municipios: string;
  Site: string;
  Local: string;
  Area: string;
  codigo?: string;
  Title: string;
}

export interface IGovernanceValveFiltersProps {
  responsible: string | null;
  id: string | null;
  place: string | null;
  startDate: Date | null;
  endDate: Date | null;
  conformity: string | null;
}
