export interface TestCmiDataModal {
  Created: Date;
  Id: number;
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
  respostas?: Record<string, Array<ResponstaTestCmi>>;
  observacao: string;
}

export interface TestCMI {
  Created: Date;
  Id: number;
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
}

export interface ResponstaTestCmi {
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

export interface ITestCMIFiltersProps {
  responsible: string | null;
  startDate: Date | null;
  endDate: Date | null;
  conformity: string | null;
  recordId: string | null;
}
