export interface EquipmentsInspectionCmi {
  Id: number;
  cod_qrcode: string;
  site?: string;
  pavimento?: string;
  conforme: boolean;
  predio: string;
}

export interface EqInspectionCmiModal {
  Id: number;
  Created: string;
  cod_qrcode: string;
  conforme: boolean;
  pavimento: string;
  predio: string;
  site: string;
  ultima_inspecao: string;
  tipo_equipamento: string;
  history: Array<{
    Id: number;
    Created: string;
    bombeiro_id: { Title: string };
    cmi_idId: number;
    observacao?: string;
    conforme: boolean;
  }>;
}
