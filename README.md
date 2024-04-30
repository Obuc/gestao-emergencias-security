# SISTEMA DE GESTÃO DE EMERGÊNCIAS

## Visão Geral do Projeto

O projeto "Sistema de Gestão de Emergências" tem como objetivo gerenciar o sistema de emergências dos sites São Paulo e Belford Roxo. Ele permite a visualização e gerenciamento de registros de checklist de equipamentos e veículos, exportação de relatórios em Excel e geração de arquivos PDF. Além disso, oferece funcionalidades como visualização do histórico de verificações de equipamentos, geração de etiquetas QR Code, utilização de aplicativo móvel para inspeção e uma agenda para acompanhamento de inspeções periódicas.


## Características Principais

- Visualização de registros de checklist
- Exportação de relatórios em Excel
- Geração de PDF dos registros
- Histórico de verificações de equipamentos
- Geração de etiquetas QR Code
- Agenda de inspeções


## Links

- Link projeto Produção: [Link](https://bayergroup.sharepoint.com/sites/005070/OBUC/emergency_system/index.html#/)
- Link projeto Desenvolvimento: [Link](https://bayergroup.sharepoint.com/sites/005070/OBUC/emergency_system-np/index.html#/)
- Sharepoint Produção Site São Paulo SPO: [Link](https://bayergroup.sharepoint.com/sites/005070/_layouts/15/viewlsts.aspx?BaseType=1&view=14)
- Sharepoint Produção Site Belford Roxo BXO: [Link](https://bayergroup.sharepoint.com/sites/005070/gestao_emergencia)
- Design Figma: [Link](https://www.figma.com/file/DZATTPF1EzcXLdblnsoA7J/Gest%C3%A3o-de-Emerg%C3%AAncia?type=design&node-id=2-2715&mode=design&t=0g0b24M7NtSilaKA-0)


## Responsáveis pelo projeto

- Web Designer - raquel.encinas@obuc.com.br
- Desenvolvedor - marcelo.silva@obuc.com.br; marcelo.silva2.ext@bayer.com
- Responsável (Bayer) - diego.almeida@bayer.com; otaviano.medeiros@bayer.com; jonas.costa@bayer.com

## Páginas e Funcionalidades

- ### Página Ínicial

Nessa página, há um botão "Select" onde ocorre a seleção de sites. Atualmente, somente o site de Belford Roxo (BXO) e São Paulo (SPO) utilizam a plataforma.
![tela_inicial](https://github.com/Obuc/gestao-emergencias-security/assets/90155206/6d07319d-88f2-4f10-a6eb-bf7ff2588c40)

- ### Página Registros

  Nessa página, contém a listagem de registros onde a página é feita de forma `Scroll Infinito` e os dados são retornados de acordo com o site. Abaixo, você poderá visualizar as páginas e também quais listas são utilizadas de acordo com o equipamento.

  ### Site São Paulo 
  ![registros_spo](https://github.com/Obuc/gestao-emergencias-security/assets/90155206/5255b9ca-3c9e-41fe-a9fb-2f96a09cfc11)
  - **Site São Paulo (SPO) - Listas Sharepoint**:
    - Extintores: [BSOC - BRAZIL SECURITY OPERATIONS CENTER - Extintores](https://bayergroup.sharepoint.com/sites/005070/Lists/Extintores/AllItems.aspx)
    - Hidrantes: [BSOC - BRAZIL SECURITY OPERATIONS CENTER - Hidrantes](https://bayergroup.sharepoint.com/sites/005070/Lists/Hidrantes/AllItems.aspx)
    - Válvulas de Governo: [BSOC - BRAZIL SECURITY OPERATIONS CENTER - Valvulas_de_Incendio](https://bayergroup.sharepoint.com/sites/005070/Lists/Valvulas_de_Incendio/AllItems.aspx)
    - Teste CMI: [BSOC - BRAZIL SECURITY OPERATIONS CENTER - Bombas_de_Incendio](https://bayergroup.sharepoint.com/sites/005070/Lists/Bombas_de_Incendio/AllItems.aspx)
    - Inspeção CMI: [BSOC - BRAZIL SECURITY OPERATIONS CENTER - Casa_de_Bombas](https://bayergroup.sharepoint.com/sites/005070/Lists/Casa_de_Bombas/AllItems.aspx)
    - Portas de Emergência: [BSOC - BRAZIL SECURITY OPERATIONS CENTER - Portas_de_Emergencia](https://bayergroup.sharepoint.com/sites/005070/Lists/Portas_de_Emergencia/AllItems.aspx)
    - Operação OEI: [BSOC - BRAZIL SECURITY OPERATIONS CENTER - Operacao_OEI](https://bayergroup.sharepoint.com/sites/005070/Lists/Operacao_OEI/AllItems.aspx)
    - Alarmes de Incêndio: [BSOC - BRAZIL SECURITY OPERATIONS CENTER - Alarmes_de_Incendio](https://bayergroup.sharepoint.com/sites/005070/Lists/Alarmes_de_Incendio/AllItems.aspx)
    - Verificação de Ambulância: [BSOC - BRAZIL SECURITY OPERATIONS CENTER - Passagem_Bombeiro](https://bayergroup.sharepoint.com/sites/005070/Lists/Passagem_Bombeiro/AllItems.aspx)
    - DEA: [BSOC - BRAZIL SECURITY OPERATIONS CENTER - Dea](https://bayergroup.sharepoint.com/sites/005070/Lists/Dea/AllItems.aspx)

  ### Site Belford Roxo
  ![registros_bxo](https://github.com/Obuc/gestao-emergencias-security/assets/90155206/87980bea-be82-4b37-9429-d74ef684c1e2)
  - **Site Belford Roxo (BXO) - Listas Sharepoint**:
    - Exintores: [GESTÃO DE EMERGÊNCIA - registros_extintor](https://bayergroup.sharepoint.com/sites/005070/gestao_emergencia/Lists/registros_extintor/AllItems.aspx)
    - Hidrantes: [GESTÃO DE EMERGÊNCIA - registros_hidrantes](https://bayergroup.sharepoint.com/sites/005070/gestao_emergencia/Lists/registros_hidrantes/AllItems.aspx)
    - Válvula de Governo: [GESTÃO DE EMERGÊNCIA - registros_valvula_governo](https://bayergroup.sharepoint.com/sites/005070/gestao_emergencia/Lists/registros_valvula_governo/AllItems.aspx)
    - Teste CMI: [GESTÃO DE EMERGÊNCIA - registros_teste_cmi](https://bayergroup.sharepoint.com/sites/005070/gestao_emergencia/Lists/registros_teste_cmi/AllItems.aspx)
    - Inspeção CMI: [GESTÃO DE EMERGÊNCIA - registros_inspecao_cmi](https://bayergroup.sharepoint.com/sites/005070/gestao_emergencia/Lists/registros_inspecao_cmi/AllItems.aspx)
    - Checklist Geral: [GESTÃO DE EMERGÊNCIA - registros_veiculos_emergencia](https://bayergroup.sharepoint.com/sites/005070/gestao_emergencia/Lists/registros_veiculos_emergencia/AllItems.aspx)
    - Relação de Carga (Scania, S10, Mercedes, Furgão, Ambulância Sprinter, Ambulância Iveco): [GESTÃO DE EMERGÊNCIA - registros_relacao_carga](https://bayergroup.sharepoint.com/sites/005070/gestao_emergencia/Lists/registros_relacao_carga/AllItems.aspx)

- ### Funcionalidades Página Registros

Em ambos os sites, na tela de registro há alguns botões de interações:


- **Exportar Planilha:** Botão para exportar a lista de registros para Excel. Serão exportados todos os registros que estão na lista, independentemente dos filtros aplicados.
  
![Screenshot_3](https://github.com/Obuc/gestao-emergencias-security/assets/90155206/d7d7725d-6c6e-41eb-bc34-23a20913fb64)

---

- **Seleção de MÊS e ANO:** O ideal seria que todos os registros fossem retornados de acordo com a filtragem. No entanto, devido a uma limitação no SharePoint, ocorre um erro de limitação se o primeiro filtro ultrapassar 5000 itens. Por conta dessa limitação, há a necessidade de ter esses filtros. Alguns formulários com menos volumes de registros têm somente o filtro de ano.

![Screenshot_4](https://github.com/Obuc/gestao-emergencias-security/assets/90155206/448cb731-326e-4c8d-86e4-7dd38afa297d)

- **Filtros:** Os campos que podem ser filtrados variam de acordo com o `SITE` e também o `EQUIPAMENTO`.
- 
![Screenshot_5](https://github.com/Obuc/gestao-emergencias-security/assets/90155206/1af895b7-e180-4acc-8c50-65218eae6c05)

- **Ações por registro:** Cada registro tem um botão de ação, onde o usuário pode visualizar, editar ou excluir o registro.

![Screenshot_6](https://github.com/Obuc/gestao-emergencias-security/assets/90155206/700924eb-5511-419e-b9da-7b22339c947d)

- **Visualização registro:** Ao clicar em `Visualizar Registro` será aberto um modal com as informações do registro selecionado, esse modal varia de acordo com o `SITE` e também o `EQUIPAMENTO`.
  
![Screenshot_7](https://github.com/Obuc/gestao-emergencias-security/assets/90155206/759e5d4d-8f4c-4eef-891c-86c90718792c)
![Screenshot_8](https://github.com/Obuc/gestao-emergencias-security/assets/90155206/294a5a90-01e7-4795-8635-b220594246b0)

- **Exportar para PDF:** Botão para exportar o registro como um PDF.

![Screenshot_9](https://github.com/Obuc/gestao-emergencias-security/assets/90155206/1cb4ed01-3289-4aa2-824b-1a7092206415)
![Screenshot_10](https://github.com/Obuc/gestao-emergencias-security/assets/90155206/beb95c29-2516-4afa-8b01-e17a71332794)


## Dependências Utilizadas
- [Font Awesome](https://docs.fontawesome.com/v5/web/use-with/react)
- [Material UI](https://mui.com/material-ui/)
- [Radix Colors](https://www.radix-ui.com/colors)
- [Radix Avatar](https://www.radix-ui.com/primitives/docs/components/avatar)
- [Radix Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox)
- [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
- [Radix Label](https://www.radix-ui.com/primitives/docs/components/label)
- [Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover)
- [Radix Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group)
- [Radix Select](https://www.radix-ui.com/primitives/docs/components/select)
- [Radix Toast](https://www.radix-ui.com/primitives/docs/components/toast)
- [Radix Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip)
- [React PDF](https://react-pdf.org/components)
- [Axios](https://axios-http.com/docs/intro)
- [Class Variance Authority](https://cva.style/docs)
- [clsx](https://github.com/lukeed/clsx#readme)
- [date-fns](https://date-fns.org/)
- [FileSaver.js](https://github.com/eligrey/FileSaver.js#readme)
- [Formik](https://formik.org/docs/overview)
- [react-data-grid](https://github.com/adazzle/react-data-grid#readme)
- [React Datepicker](https://reactdatepicker.com/)
- [React Select](https://react-select.com/home)
- [sp-rest-proxy](https://github.com/koltyakov/sp-rest-proxy)
- [Tailwind CSS](https://tailwindcss.com/)
- [xlsx](https://www.npmjs.com/package/xlsx)
- [yup](https://www.npmjs.com/package/yup)

## Instalação e Configuração

- Alterar o nome do arquivo `.env.example` para `.env`.
- Instalar as dependências com `npm install`.
- Executar o proxy-sharepoint com `npm run serve` e `npm run serveParent`.
- Ao executar pela primeira vez, será questionada a URL do Sharepoint e método de autenticação (pode ser selecionado o primeiro), email e senha com permissão de acesso ao sharepoint informado.
- As url que estão sendo utilizadas em produção você pode encontrar no arquivo `.env.example`.
- No arquivo `.env` você deve adicionar as url de desenvolvimento proxies sharepoint nas váriaveis `VITE_BASE_URL_SHAREPOINT_DEV` e `VITE_BASE_URL_SHAREPOINT_PARENT_DEV`.
- Para executar o projeto locamente a váriavel `VITE_ENV` deve ser `development` para fazer a build do projeto em produção deve ser alterado para `prod`.
- Executar projeto `npm run dev`.

## Pré-requisitos

Para rodar o projeto, você deve ter acesso ao sharepoint [BOSC - BRAZIL SECURITY OPERATIONS CENTER](https://bayergroup.sharepoint.com/sites/005070/default.aspx) e também ao subsite [GESTÃO DE EMERGÊNCIAS](https://bayergroup.sharepoint.com/sites/005070/gestao_emergencia)
