export interface ExtinguisherProps {
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

export interface ExtinguisherModalProps {
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

export interface ExtinguisherFormProps {
  siteId: number | null;
  predioId: number | null;
  pavimentoId: number | null;
  localId: number | null;
  tipo_extintorId: number | null;
  massaId: number | null;
}

interface ISelectValue {
  label: string;
  value: string;
}

export interface ExtinguisherFiltersProps {
  id: string | null;
  pavement: ISelectValue | null;
  place: Array<ISelectValue> | [];
  extinguisherType: ISelectValue | null;
  extinguisherId: string | null;
  conformity: string | null;
}

export interface ExtinguisherFiltersQRCodeProps {
  id: string | null;
  cod_equipamento: string | null;
  predio: string | null;
  local: string | null;
  pavimento: string | null;
}
