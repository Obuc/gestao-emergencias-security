export interface TestCmi {
  Id: number;
  Created: Date;
  Responsavel1?: string;
  Local: string;
  // Bomba Jockey 1
  OData__x0042_j11: string;
  OData__x0042_j12: string;
  OData__x0042_j13: string;
  OData__x0042_j14: boolean;
  // Bomba Jockey 2
  OData__x0042_j21: string;
  OData__x0042_j22: string;
  OData__x0042_j23: string;
  OData__x0042_j24: boolean;
  // Bomba Principal 1
  OData__x0042_p11: string;
  OData__x0042_p12: string;
  OData__x0042_p13: string;
  OData__x0042_p14: string;
  OData__x0042_p15: string;
  // Bomba Principal 2
  OData__x0042_p21: string;
  OData__x0042_p22: string;
  OData__x0042_p23: string;
  OData__x0042_p24: string;
  OData__x0042_p25: string;
  // Bomba Booster 1
  OData__x0042_b11: string;
  OData__x0042_b12: string;
  OData__x0042_b13: string;
  // Bomba Booster 2
  OData__x0042_b21: string;
  OData__x0042_b22: string;
  OData__x0042_b23: string;
  // Gerador
  OData__x0047_er1: boolean;
  OData__x0047_er2: boolean;

  conforme: boolean;
}

export interface TestCmiModal {
  Id: number;
  Created: Date;
  Responsavel1?: string;
  // Bomba Jockey 1
  OData__x0042_j11: string;
  OData__x0042_j12: string;
  OData__x0042_j13: string;
  OData__x0042_j14: boolean;
  // Bomba Jockey 2
  OData__x0042_j21: string;
  OData__x0042_j22: string;
  OData__x0042_j23: string;
  OData__x0042_j24: boolean;
  // Bomba Principal 1
  OData__x0042_p11: string;
  OData__x0042_p12: string;
  OData__x0042_p13: string;
  OData__x0042_p14: string;
  OData__x0042_p15: string;
  // Bomba Principal 2
  OData__x0042_p21: string;
  OData__x0042_p22: string;
  OData__x0042_p23: string;
  OData__x0042_p24: string;
  OData__x0042_p25: string;
  // Bomba Booster 1
  OData__x0042_b11: string;
  OData__x0042_b12: string;
  OData__x0042_b13: string;
  // Bomba Booster 2
  OData__x0042_b21: string;
  OData__x0042_b22: string;
  OData__x0042_b23: string;
  // Gerador
  OData__x0047_er1: boolean;
  OData__x0047_er2: boolean;

  Observacao?: string;
  UF: string;
  Municipios: string;
  Site: string;
  Local: string;
  Area: string;
}

export interface ITestCmiFiltersProps {
  responsible: string | null;
  id: string | null;
  place: string | null;
  startDate: Date | null;
  endDate: Date | null;
  conformity: string | null;
}
