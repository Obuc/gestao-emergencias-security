export interface ExtinguisherDataModal {
  Created: Date;
  Id: number;
  bombeiro: string;
  data_pesagem: string;
  extintor: {
    Id: number;
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
  respostas?: Record<string, Array<ExtinguisherAnswers>>;
  novo: boolean;
  observacao: string;
}

export interface Extinguisher {
  Created: Date;
  Id: number;
  bombeiro: string;
  conforme: boolean;
  data_pesagem: Date;
  extintor: {
    predio: string;
    pavimento: string;
    local: string;
    cod_extintor: string;
    validade: Date;
  };
  respostas?: Record<string, Array<ExtinguisherAnswers>>;
  novo: boolean;
  observacao: string;
}

export interface ExtinguisherAnswers {
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

interface ISelectValue {
  label: string;
  value: string;
}

export interface IExtinguisherFiltersProps {
  responsible: string | null;
  startDate: Date | null;
  endDate: Date | null;
  expiration: Date | null;
  place: Array<ISelectValue> | [];
  pavement: Array<ISelectValue> | [];
  conformity: string | null;
  extinguisherId: string | null;
}
