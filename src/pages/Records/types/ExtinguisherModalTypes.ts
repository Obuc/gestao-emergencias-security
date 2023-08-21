import { RespostaExtintor } from './Extinguisher';

export interface ExtinguisherDataModal {
  Created: string;
  Id: number;
  Modified: string;
  Title: null;
  bombeiro: string;
  data_pesagem: string;
  extintor: {
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
