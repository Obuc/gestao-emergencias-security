export interface Extinguisher {
  Id: number;
  Created: Date;
  DataVenc: Date;
  DataPesagem: Date;
  Responsavel1?: string;
  Title: string;
  Local: string;
  Pavimento: string;
  LocalEsp: string;
  OData__x004d_an1: boolean;
  OData__x004d_an2: boolean;
  OData__x0043_ar1: boolean;
  OData__x0043_ar2: boolean;
  OData__x0043_il2: boolean;
  OData__x0043_il1: boolean;
  OData__x0043_il3: boolean;
  OData__x0053_in1: boolean;
  OData__x0053_in2: boolean;
  OData_Obst1: boolean;
  OData_Obst2: boolean;
  OData__x004c_tv1: boolean;
  OData__x004c_tv2: boolean;
  conforme: boolean;
}

export interface ExtinguisherModal {
  Id: number;
  Title?: string;
  Created: Date;
  DataVenc: Date | null;
  Responsavel1?: string;
  Local: string;
  Pavimento: string;
  LocalEsp: string;
  OData__x004d_an1: boolean;
  OData__x004d_an2: boolean;
  OData__x0043_ar1: boolean;
  OData__x0043_ar2: boolean;
  OData__x0043_il2: boolean;
  OData__x0043_il1: boolean;
  OData__x0043_il3: boolean;
  OData__x0053_in1: boolean;
  OData__x0053_in2: boolean;
  Obst1: boolean;
  Obst2: boolean;
  OData__x004c_tv1: boolean;
  OData__x004c_tv2: boolean;
  Observacao?: string;
  UF: string;
  Municipios: string;
  Site: string;
  Area: string;
  Tipo: string;
  Massa: string;
  codExtintor: string;
  codigo: string;
}

interface ISelectValue {
  label: string;
  value: string;
}

export interface IExtinguisherFiltersProps {
  responsible: string | null;
  startDate: Date | null;
  endDate: Date | null;
  expiration: Date | null;
  place: Array<ISelectValue> | [];
  pavement: Array<ISelectValue> | [];
  conformity: string | null;
  extinguisherId: string | null;

  weighingDate: Date | null;
  placeSPO: string | null;
  pavementSPO: string | null;
  specificLocationSPO: string | null;
}
