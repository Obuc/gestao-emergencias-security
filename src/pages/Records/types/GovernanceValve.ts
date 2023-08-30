export interface GovernanceValve {
  Created: string;
  data_legado?: string;
  Id: number;
  Title: null;
  bombeiro: string;
  conforme: boolean;
  valvula: {
    Id: string;
    site: string;
    predio: string;
    pavimento: string;
    local: string;
    cod_equipamento: string;
    conforme: boolean;
    cod_qrcode: string;
  };
  respostas?: Record<string, Array<RespostaValvulas>>;
  observacao: string;
}

export interface RespostaValvulas {
  Id: number;
  extintor_idId: number;
  pergunta_id: PerguntaExtintor;
  registro_idId: number;
  resposta: boolean;
}

export interface PerguntaExtintor {
  Title: string;
  categoria: string;
  Id: number;
}
