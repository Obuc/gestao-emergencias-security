export interface IEqLoadRatio {
  Id: number;
  cod_qrcode: string;
  site: string;
  placa: string;
  tipo_veiculo: string;
  ultima_inspecao?: string;
  conforme: boolean;
}

export interface IEqLoadRatioModal {
  Id: number;
  Created: string;
  cod_qrcode: string;
  conforme: boolean;
  site: string;
  ultima_inspecao: string;
  tipo_veiculo: string;
  placa: string;
  history: Array<{
    Id: number;
    Created: string;
    bombeiro: { Title: string };
    cmi_idId: number;
    observacao?: string;
    conforme: boolean;
  }>;
}

export interface IEqLoadRatioFiltersProps {
  id: string | null;
  plate: string | null;
  conformity: string | null;
}
