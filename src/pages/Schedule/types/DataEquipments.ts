export interface DataEquipments {
  type: string;
  Id: number;
  proxima_inspecao: Date;
  ultima_inspecao: Date;
  frequencia: number;
  realizadaForaDoPrazo: boolean;
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
