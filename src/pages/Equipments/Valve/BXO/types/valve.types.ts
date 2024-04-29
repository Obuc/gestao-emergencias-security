export interface ValveProps {
  Id: number;
  cod_qrcode: string;
  cod_equipamento: string;
  site?: string;
  pavimento?: string;
  local?: string;
  predio?: string;
  conforme: boolean;
}

export interface ValveModal {
  Id: number;
  cod_equipamento: string;
  cod_qrcode: string;
  conforme: boolean;
  local: string;
  pavimento: string;
  predio: string;
  site: string;
  ultima_inspecao: string;
}

export interface ValveHistoryProps {
  Id: number;
  bombeiro_id: { Title: string };
  valvula_id: { Id: number };
  observacao: string;
  conforme: boolean;
  Created: string;
  data_legado?: string;
}

interface ISelectValue {
  label: string;
  value: string;
}

export interface ValveFiltersProps {
  id: string | null;
  pavement: ISelectValue | null;
  predio: string | null;
  place: Array<ISelectValue> | [];
  valveId: string | null;
  conformity: string | null;
}
