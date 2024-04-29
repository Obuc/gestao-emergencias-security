export interface LoadRatioProps {
  Id: number;
  cod_qrcode: string;
  site: string;
  placa: string;
  tipo_veiculo: string;
  ultima_inspecao?: string;
  conforme: boolean;
}

export interface LoadRatioModalProps {
  Id: number;
  Created: string;
  cod_qrcode: string;
  conforme: boolean;
  site: string;
  ultima_inspecao: string;
  tipo_veiculo: string;
  placa: string;
}

export interface LoadRatioHistoryModalProps {
  Id: number;
  Created: string;
  bombeiro: { Title: string };
  cmi_idId: number;
  observacao?: string;
  conforme: boolean;
}

export interface LoadRatioFiltersProps {
  id: string | null;
  plate: string | null;
  conformity: string | null;
}
