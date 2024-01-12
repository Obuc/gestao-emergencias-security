import RestProxy from "sp-rest-proxy";

const settings = {
  configPath: "./config/private.json", // Local para mapeamento e credenciais de instância do SharePoint
  port: 8080,                          // Porta do servidor local
};

const restProxy = new RestProxy(settings);
restProxy.serve();
