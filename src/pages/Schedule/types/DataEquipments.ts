export interface DataEquipments {
  emAlerta: boolean;
  type: string;
  Id: number;
  proximas_inspecoes: Array<Date>;
  proxima_inspecao: Date;
  ultima_inspecao: Date;
  vencido: boolean;
}
