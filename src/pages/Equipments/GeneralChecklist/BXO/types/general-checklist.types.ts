export interface GeneralChecklistProps {
  Id: number;
  cod_qrcode: string;
  site: string;
  placa: string;
  tipo_veiculo: string;
  ultima_inspecao?: string;
  conforme_check_geral: boolean;
}

export interface GeneralChecklistModalProps {
  Id: number;
  Created: string;
  cod_qrcode: string;
  conforme: boolean;
  site: string;
  ultima_inspecao: string;
  tipo_veiculo: string;
  placa: string;
}

export interface GeneralChecklistHistoryModalProps {
  Id: number;
  Created: string;
  bombeiro: { Title: string };
  cmi_idId: number;
  observacao?: string;
  conforme: boolean;
}

interface ISelectValue {
  label: string;
  value: string;
}

export interface GeneralChecklistFiltersProps {
  id: string | null;
  vehicleType: ISelectValue | null;
  plate: string | null;
  conformity: string | null;
}
