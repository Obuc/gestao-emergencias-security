export interface ExtinguisherProps {
  Id: number;
  cod_qrcode: string;
  site?: string;
  pavimento?: string;
  local?: string;
  predio?: string;
  tipo_extintor?: string;
  cod_extintor: string;
  conforme: boolean;
}

export interface ExtinguisherModalProps {
  Id: number;
  cod_extintor: string;
  cod_qrcode: string;
  conforme: boolean;
  local: string;
  massa: string;
  pavimento: string;
  predio: string;
  site: string;
  tipo_extintor: string;
  validade: string;
  ultima_inspecao: string;
}

export interface ExtinguisherHistoryModalProps {
  Id: number;
  bombeiro_id: { Title: string };
  data_pesagem: string;
  extintor_idId: number;
  novo: boolean;
  observacao: string;
  status?: string;
  conforme: boolean;
  Created: string;
  cod_extintor: string;
}

interface ISelectValue {
  label: string;
  value: string;
}

export interface ExtinguisherFiltersProps {
  id: string | null;
  pavement: ISelectValue | null;
  place: Array<ISelectValue> | [];
  extinguisherType: ISelectValue | null;
  extinguisherId: string | null;
  conformity: string | null;
}
