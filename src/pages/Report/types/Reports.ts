interface Attachments {
  FileName: string;
  ServerRelativeUrl: string;
}

export interface IReports {
  AttachmentFiles: Array<Attachments>;
  Attachments: boolean;
  Created: string;
  Id: number;
  dias_antecedentes_alerta: number;
  emissao: string;
  excluido: boolean;
  site: {
    Title: string;
  };
  tipo_laudo: {
    Title: string;
  };
  validade: string;
}
