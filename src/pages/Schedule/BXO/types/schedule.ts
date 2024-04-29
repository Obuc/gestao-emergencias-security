export interface DataEquipments {
  type: string;
  Id: number;
  proxima_inspecao: Date;
  ultima_inspecao: Date;
  frequencia: number;
  realizada_fora_do_prazo: boolean;
  deveria_ser_realizada: Date;
}

export interface DataEquipmentsModal {
  Id: number;
  ultima_inspecao: Date | null;
  proximaInspecao?: Date;
  predio?: string;
  pavimento?: string;
  local?: string;

  tipo_veiculo?: string;
  placa?: string;
}
