export interface Attachments {
  FileName: string;
  ServerRelativeUrl: string;
}

export interface IReports {
  AttachmentFiles: Array<Attachments>;
  file: Array<File>;
  Attachments: boolean;
  Created: Date | null;
  numero_laudo_revalidado: number | null;
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

export interface IReportsFiltersProps {
  id: string | null;
  startDate: Date | null;
  endDate: Date | null;
  emission: Date | null;
  validity: Date | null;
  reportType: { label: string; value: string } | null;
}
