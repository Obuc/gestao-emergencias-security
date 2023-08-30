export interface EquipmentsGovernanceValve {
  Id: number;
  cod_qrcode: string;
  cod_equipamento: string;
  site?: string;
  pavimento?: string;
  local?: string;
  predio?: string;
  cod_extintor: string;
  conforme: boolean;
}

export interface EqGovernanceValveModal {
  cod_equipamento: string;
  cod_qrcode: string;
  conforme: boolean;
  local: string;
  pavimento: string;
  predio: string;
  site: string;
  ultima_inspecao: string;

  history: Array<{
    Id: number;
    bombeiro_id: { Title: string };
    valvula_id: { Id: number };
    observacao: string;
    conforme: boolean;
    Created: string;
    data_legado?: string;
  }>;
}
