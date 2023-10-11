export interface HydrantsDataModal {
  Created: Date;
  Id: number;
  bombeiro: string;
  hidrante: {
    Id: number;
    site: string;
    predio: string;
    pavimento: string;
    local: string;
    cod_hidrante: string;
    conforme: boolean;
    cod_qrcode: string;
    possui_abrigo: boolean | null;
  };
  respostas?: Record<string, Array<RespostaHydrants>>;
  observacao: string;
}

export interface Hydrants {
  Created: Date;
  Id: number;
  bombeiro: string;
  conforme: boolean;
  hidrante: {
    site: string;
    predio: string;
    pavimento: string;
    local: string;
    cod_qrcode: string;
    cod_hidrante: string;
  };
  respostas?: Record<string, Array<RespostaHydrants>>;
  observacao: string;
}

export interface RespostaHydrants {
  Id: number;
  hidrante_idId: number;
  pergunta_id: PerguntaHydrants;
  registro_idId: number;
  resposta: boolean;
}

export interface PerguntaHydrants {
  Title: string;
  categoria: string;
  Id: number;
}

export interface IHydrantsFiltersProps {
  responsible: string | null;
  startDate: Date | null;
  endDate: Date | null;
  codHydrant: string | null;
  place: Array<string> | [];
  pavement: Array<string> | [];
  conformity: string | null;
  recordId: string | null;
}
