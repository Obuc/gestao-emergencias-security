export interface IEqGeneralChecklist {
  Id: number;
  cod_qrcode: string;
  site: string;
  placa: string;
  tipo_veiculo: string;
  ultima_inspecao?: string;
  conforme_check_geral: boolean;
}

export interface IEqGeneralChecklistModal {
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

export interface IEqGeneralChecklistFiltersProps {
  id: string | null;
  vehicleType: Array<string> | [];
  plate: string | null;
  conformity: string | null;
}
