export interface InspectionCmi {
  Id: number;
  Created: Date;
  Responsavel1?: string;
  Local: string;
  OData__x0050_e1: boolean;
  OData__x0050_e2: boolean;
  OData__x0050_e3: boolean;
  OData__x0050_e4: boolean;
  OData__x0050_e5: boolean;
  OData__x0052_es1: boolean;
  OData__x0052_es2: boolean;
  OData__x0052_es3: boolean;
  OData__x0052_es4: boolean;
  OData__x0052_es5: boolean;
  OData__x0052_es6: boolean;
  OData__x0052_es7: boolean;
  OData__x0042_i1: boolean;
  OData__x0042_i2: boolean;
  OData__x0042_i3: boolean;
  OData__x0042_i4: boolean;
  OData__x0042_i5: boolean;
  OData__x0042_i6: boolean;
  OData__x0044_iv1: boolean;
  OData__x0044_iv2: boolean;
  OData__x0044_iv3: boolean;
  OData__x0044_iv4: boolean;
  OData__x0044_iv5: boolean;
  OData__x0044_iv6: boolean;
  OData__x0047_er1: boolean;
  OData__x0047_er2: boolean;
  OData__x0047_er3: boolean;
  OData__x0047_er4: boolean;
  OData__x0043_b1: boolean;
  OData__x0043_b2: boolean;
  OData__x0043_b3: boolean;
  OData__x0043_b4: boolean;
  OData__x0043_b5: boolean;
  conforme: boolean;
}

export interface InspectionCmiModal {
  Id: number;
  Created: Date | null;
  Responsavel1?: string;
  OData__x0050_e1: boolean;
  OData__x0050_e2: boolean;
  OData__x0050_e3: boolean;
  OData__x0050_e4: boolean;
  OData__x0050_e5: boolean;
  OData__x0052_es1: boolean;
  OData__x0052_es2: boolean;
  OData__x0052_es3: boolean;
  OData__x0052_es4: boolean;
  OData__x0052_es5: boolean;
  OData__x0052_es6: boolean;
  OData__x0052_es7: boolean;
  OData__x0042_i1: boolean;
  OData__x0042_i2: boolean;
  OData__x0042_i3: boolean;
  OData__x0042_i4: boolean;
  OData__x0042_i5: boolean;
  OData__x0042_i6: boolean;
  OData__x0044_iv1: boolean;
  OData__x0044_iv2: boolean;
  OData__x0044_iv3: boolean;
  OData__x0044_iv4: boolean;
  OData__x0044_iv5: boolean;
  OData__x0044_iv6: boolean;
  OData__x0047_er1: boolean;
  OData__x0047_er2: boolean;
  OData__x0047_er3: boolean;
  OData__x0047_er4: boolean;
  OData__x0043_b1: boolean;
  OData__x0043_b2: boolean;
  OData__x0043_b3: boolean;
  OData__x0043_b4: boolean;
  OData__x0043_b5: boolean;

  Observacao?: string;
  UF: string;
  Municipios: string;
  Site: string;
  Local: string;
  Area: string;
}

export interface IInspectionCmiFiltersProps {
  responsible: string | null;
  id: string | null;
  place: string | null;
  startDate: Date | null;
  endDate: Date | null;
  conformity: string | null;
}
