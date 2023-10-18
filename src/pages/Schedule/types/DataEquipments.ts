export interface DataEquipments {
  type: string;
  Id: number;
  proxima_inspecao: Date;
  ultima_inspecao: Date;
}

export interface DataEquipmentsModal {
  Id: number;
  ultima_inspecao: Date | null;
  predio?: string;
  pavimento?: string;
  local?: string;
}
