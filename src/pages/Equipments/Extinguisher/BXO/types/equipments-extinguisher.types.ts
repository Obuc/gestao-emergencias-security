export interface EquipmentsExtinguisherProps {
  Id: number;
  cod_qrcode: string;
  site?: string;
  pavimento?: string;
  local?: string;
  predio?: string;
  tipo_extintor?: string;
  cod_extintor: string;
  conforme: boolean;
}

export interface EquipmentsExtinguisherModalProps {
  cod_extintor: string;
  cod_qrcode: string;
  conforme: boolean;
  local: string;
  massa: string;
  pavimento: string;
  predio: string;
  site: string;
  tipo_extintor: string;
  validade: string;
  ultima_inspecao: string;

  history: Array<{
    Id: number;
    bombeiro_id: { Title: string };
    data_pesagem: string;
    extintor_idId: number;
    novo: boolean;
    observacao: string;
    status?: string;
    conforme: boolean;
    Created: string;
    cod_extintor: string;
  }>;
}

export interface EquipmentsExtinguisherFiltersProps {
  id: string | null;
  pavement: Array<string> | [];
  place: Array<string> | [];
  extinguisherType: Array<string> | [];
  extinguisherId: string | null;
  conformity: string | null;
}

export interface EquipmentsExtinguisherFiltersQRCodeProps {
  id: string | null;
  cod_equipamento: string | null;
  predio: string | null;
  local: string | null;
  pavimento: string | null;
}
