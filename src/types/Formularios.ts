export interface IFormulario {
  Id: number;
  Title: string;
  site: {
    Title?: string;
  };
  todos_sites: boolean;
  submenu: boolean;
  menu_equipamento: boolean;
}
