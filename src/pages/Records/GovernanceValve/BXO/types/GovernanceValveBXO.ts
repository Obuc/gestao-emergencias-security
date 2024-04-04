export interface GovernanceValve {
  Created: Date;
  Id: number;
  bombeiro: string;
  conforme: boolean;
  valvula: {
    Id: string;
    site: string;
    predio: string;
    pavimento: string;
    local: string;
    cod_equipamento?: string;
    conforme: boolean;
    cod_qrcode: string;
  };
  respostas?: Record<string, Array<RespostaValvulas>>;
  observacao: string;
}

export interface RespostaValvulas {
  Id: number;
  extintor_idId: number;
  pergunta_id: PerguntaValvulas;
  registro_idId: number;
  resposta: boolean;
}

export interface PerguntaValvulas {
  Title: string;
  categoria: string;
  Id: number;
}

interface ISelectValue {
  label: string;
  value: string;
}

export interface IGovernanceValveFiltersProps {
  responsible: string | null;
  id: string | null;
  valveNumber: string | null;
  property: ISelectValue | null;
  startDate: Date | null;
  endDate: Date | null;
  conformity: string | null;
}
