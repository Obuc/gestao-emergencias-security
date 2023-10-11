export interface IFormulario {
  Id: number;
  url_path: string;
  Title: string;
  site: {
    Title?: string;
  };
  todos_sites: boolean;
  submenu: boolean;
  menu_equipamento: boolean;
}
