export interface IGeneralChecklist {
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

export interface IGeneralChecklistModal {
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
  respostas?: Record<string, Array<IRespostaGeneralChecklist>>;
}

export interface IRespostaGeneralChecklist {
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
