export interface CmiTestProps {
  Id: number;
  pavimento?: string;
  predio: string;
  cod_qrcode: string;
  site?: string;
  conforme: boolean;
}

export interface CmiTestModal {
  Id: number;
  Created: string;
  cod_qrcode: string;
  conforme: boolean;
  pavimento: string;
  predio: string;
  site: string;
  ultima_inspecao: string;
  tipo_equipamento: string;
}

export interface CmiTestHistoryProps {
  Id: number;
  Created: string;
  bombeiro_id: { Title: string };
  cmi_idId: number;
  observacao?: string;
  conforme: boolean;
}

interface ISelectValue {
  label: string;
  value: string;
}

export interface CmiTestFiltersProps {
  id: string | null;
  pavement: ISelectValue | null;
  predio: string | null;
  cod_qrcode: string | null;
  conformity: string | null;
}
