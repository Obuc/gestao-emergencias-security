export interface EquipmentsExtinguisher {
  Id: number;
  cod_qrcode: string;
  site?: string;
  pavimento?: string;
  local?: string;
  predio?: string;
  cod_extintor: string;
  conforme: boolean;

  // Created: string;
  // EditorId: number;
  // GUID: string;
  // Title: string;
  // excluido: boolean;
  // massaId: number;
  // predioId: number;
  // tipo_extintorId: number;
  // ultima_inspecao: string;
  // validade: string;
}

export interface EqExtinguisherModal {
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
