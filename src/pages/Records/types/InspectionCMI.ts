export interface InspectionCmiDataModal {
  Created: string;
  Id: number;
  Modified: string;
  Title: null;
  bombeiro: string;
  cmi: {
    Id: number;
    site: string;
    predio: string;
    local: string;
    validade: string;
    conforme: boolean;
    cod_qrcode: string;
  };
  respostas?: Record<string, Array<ResponstaInspectionCMI>>;
  novo: boolean;
  observacao: string;
  status: string;
}

export interface InspectionCMI {
  Created: string;
  Id: number;
  Title: null;
  bombeiro_id: {
    Title: string;
  };
  bombeiro_idId: number;
  cmi_idId: number;
  conforme: boolean;
  data_legado: null;
  observacao: null;
  site: {
    Title: string;
  };
  siteId: number;
  cmi: {
    Id: number;
    predio: string;
  };
}

export interface ResponstaInspectionCMI {
  Id: number;
  cmi_idId: number;
  pergunta_id: PerguntaExtintor;
  registro_idId: number;
  resposta: boolean;
  resposta_2?: string;
}

export interface PerguntaExtintor {
  Title: string;
  categoria: string;
  Id: number;
}
