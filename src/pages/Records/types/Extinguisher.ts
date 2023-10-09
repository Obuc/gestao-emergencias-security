export interface ExtinguisherDataModal {
  Created: string;
  Id: number;
  Modified: string;
  Title: null;
  bombeiro: string;
  data_pesagem: string;
  extintor: {
    Id: number;
    site: string;
    predio: string;
    pavimento: string;
    local: string;
    cod_extintor: string;
    validade: string;
    conforme: boolean;
    massa: string;
    cod_qrcode: string;
    tipo_extintor: string;
  };
  respostas?: Record<string, Array<RespostaExtintor>>;
  novo: boolean;
  observacao: string;
  status: null;
}

export interface Extinguisher {
  Attachments: boolean;
  AuthorId: number;
  Created: Date;
  Id: number;
  Modified: string;
  Title: null;
  bombeiro_idId: number;
  bombeiro: string;
  conforme: boolean;
  data_pesagem: Date;
  extintor_idId: number;
  extintor: {
    site: string;
    predio: string;
    pavimento: string;
    local: string;
    cod_extintor: string;
    validade: Date;
    conforme: boolean;
    massa: string;
    cod_qrcode: string;
    tipo_extintor: string;
  };
  respostas?: Record<string, Array<RespostaExtintor>>;
  novo: boolean;
  observacao: string;
  status: null;
}

export interface RespostaExtintor {
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

export interface IExtinguisherFiltersProps {
  responsible: string | null;
  startDate: Date | null;
  endDate: Date | null;
  expiration: Date | null;
  place: Array<string> | [];
  pavement: Array<string> | [];
  conformity: string | null;
}
