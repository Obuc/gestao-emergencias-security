export interface CmiInspectionProps {
  Id: number;
  cod_qrcode: string;
  site?: string;
  pavimento?: string;
  conforme: boolean;
  predio: string;
}

export interface CmiInspectionModal {
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

export interface CmiInspectionHistoryProps {
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

export interface CmiInspectionFiltersProps {
  id: string | null;
  pavement: ISelectValue | null;
  predio: string | null;
  cod_qrcode: string | null;
  conformity: string | null;
}
