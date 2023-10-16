export interface IEqHydrants {
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

export interface IEqHydrantModal {
  cod_hidrante: string;
  cod_qrcode: string;
  conforme: boolean;
  local: string;
  pavimento: string;
  predio: string;
  site: string;
  possui_abrigo: boolean;
  history: Array<{
    Id: number;
    bombeiro: { Title: string };
    hidrante_id: { Id: number };
    observacao: string;
    conforme: boolean;
    Created: string;
  }>;
}

export interface IEqHydrantsFiltersProps {
  id: string | null;
  pavement: Array<string> | [];
  place: Array<string> | [];
  hydrantId: string | null;
  conformity: string | null;
  hasShelter: string | null;
}
