export interface HydrantProps {
  Id: number;
  cod_qrcode: string;
  cod_hidrante: string;
  site?: string;
  predio?: string;
  pavimento?: string;
  local?: string;
  conforme: boolean;
  possui_abrigo: boolean;
}

export interface HydrantModal {
  Id: number;
  cod_hidrante: string;
  cod_qrcode: string;
  conforme: boolean;
  local: string;
  pavimento: string;
  predio: string;
  site: string;
  possui_abrigo: boolean;
}

export interface HydrantsHistoryProps {
  Id: number;
  bombeiro: { Title: string };
  hidrante_id: { Id: number };
  observacao: string;
  conforme: boolean;
  Created: string;
  data_pesagem: string;
  novo: boolean;
  status?: string;
}

interface ISelectValue {
  label: string;
  value: string;
}

export interface HydrantFiltersProps {
  id: string | null;
  pavement: ISelectValue | null;
  place: Array<ISelectValue> | [];
  hydrantId: string | null;
  conformity: string | null;
  hasShelter: ISelectValue | null;
}
