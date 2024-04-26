export interface ILoadRatio {
  Created: Date;
  Id: number;
  bombeiro: string;
  bombeiroId: number;
  conforme: boolean;
  observacao: string | null;
  site: {
    Title: string;
  };
  siteId: number;
  veiculo: {
    Id: number;
    placa: string;
    site: string;
    tipo_veiculo: string;
  };
  veiculo_idId: number;
}

export interface ILoadRatioModal {
  Created: Date;
  Id: number;
  bombeiro: string;
  bombeiroId: number | null;
  conforme: boolean | null;
  observacao: string | null;
  site: string;
  siteId: number | null;
  veiculo: {
    Id: number | null;
    placa: string;
    site: string;
    tipo_veiculo: string;
  };
  veiculo_idId: number | null;
  respostas?: Record<string, Array<IRespostaLoadRatio>>;
}

export interface IRespostaLoadRatio {
  Id: number;
  veiculo_idId: number;
  pergunta_id: IPergunta;
  registro_idId: number;
  resposta: boolean;
}

export interface IPergunta {
  Title: string;
  categoria: string;
  Id: number;
}

export interface ILoadRatioFiltersProps {
  recordId: string | null;
  plate: string | null;
  responsible: string | null;
  startDate: Date | null;
  endDate: Date | null;
  conformity: string | null;
}
