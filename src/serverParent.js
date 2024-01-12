import RestProxy from "sp-rest-proxy";

const settings = {
  configPath: "./config/privateParent.json", // Local para mapeamento e credenciais de instância do SharePoint
  port: 3000,                                 // Porta do servidor local
};

const restProxy = new RestProxy(settings);
restProxy.serve();
