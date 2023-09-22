export interface Attachments {
  FileName: string;
  ServerRelativeUrl: string;
}

export interface IReports {
  AttachmentFiles: Array<Attachments>;
  file: Array<File>;
  Attachments: boolean;
  Created: Date | null;
  Id: number;
  dias_antecedentes_alerta: number;
  emissao: Date | null;
  excluido: boolean;
  site: {
    Title: string;
  };
  tipo_laudo: {
    Id: number;
    Title: string;
  };
  tipo_laudoId: number | null;
  siteId: number | null;
  validade: Date | null;
  revalidado: boolean;
}

export interface ITipoLaudo {
  Id: number;
  Title: string;
  site: {
    Title: string;
  };
}
