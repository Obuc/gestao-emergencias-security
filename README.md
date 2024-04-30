# SISTEMA DE GESTÃO DE EMERGÊNCIAS

## Visão Geral do Projeto

O projeto "Sistema de Gestão de Emergências" tem como objetivo gerenciar o sistema de emergências dos sites São Paulo e Belford Roxo. Ele permite a visualização e gerenciamento de registros de checklist de equipamentos e veículos, exportação de relatórios em Excel e geração de arquivos PDF. Além disso, oferece funcionalidades como visualização do histórico de verificações de equipamentos, geração de etiquetas QR Code, utilização de aplicativo móvel para inspeção e uma agenda para acompanhamento de inspeções periódicas.

### Características Principais

- Visualização de registros de checklist
- Exportação de relatórios em Excel
- Geração de PDF dos registros
- Histórico de verificações de equipamentos
- Geração de etiquetas QR Code
- Agenda de inspeções

### Links

- Link projeto Produção: [Link](https://bayergroup.sharepoint.com/sites/005070/OBUC/emergency_system/index.html#/)
- Link projeto Desenvolvimento: [Link](https://bayergroup.sharepoint.com/sites/005070/OBUC/emergency_system-np/index.html#/)
- Sharepoint Produção Site São Paulo SPO: [Link](https://bayergroup.sharepoint.com/sites/005070/_layouts/15/viewlsts.aspx?BaseType=1&view=14)
- Sharepoint Produção Site Belford Roxo BXO: [Link](https://bayergroup.sharepoint.com/sites/005070/gestao_emergencia)
- Design Figma: [Link](https://www.figma.com/file/DZATTPF1EzcXLdblnsoA7J/Gest%C3%A3o-de-Emerg%C3%AAncia?type=design&node-id=2-2715&mode=design&t=0g0b24M7NtSilaKA-0)

## Responsáveis pelo projeto

- Web Designer - raquel.encinas@obuc.com.br
- Desenvolvedor - marcelo.silva@obuc.com.br; marcelo.silva2.ext@bayer.com
- Responsável (Bayer) - diego.almeida@bayer.com; otaviano.medeiros@bayer.com; jonas.costa@bayer.com

### Páginas e Funcionalidades

- Página Ínicial

### Dependências Utilizadas

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

### Instalação e Configuração

- Alterar o nome do arquivo `.env.example` para `.env`.
- Instalar as dependências com `npm install`.
- Executar o proxy-sharepoint com `npm run serve` e `npm run serveParent`.
- Ao executar pela primeira vez, será questionada a URL do Sharepoint e método de autenticação (pode ser selecionado o primeiro), email e senha com permissão de acesso ao sharepoint informado.
- As url que estão sendo utilizadas em produção você pode encontrar no arquivo `.env.example`.
- No arquivo `.env` você deve adicionar as url de desenvolvimento proxies sharepoint nas váriaveis `VITE_BASE_URL_SHAREPOINT_DEV` e `VITE_BASE_URL_SHAREPOINT_PARENT_DEV`.
- Para executar o projeto locamente a váriavel `VITE_ENV` deve ser `development` para fazer a build do projeto em produção deve ser alterado para `prod`.
- Executar projeto `npm run dev`.

#### Pré-requisitos

Para rodar o projeto, você deve ter acesso ao sharepoint [BOSC - BRAZIL SECURITY OPERATIONS CENTER](https://bayergroup.sharepoint.com/sites/005070/default.aspx) e também ao subsite [GESTÃO DE EMERGÊNCIAS](https://bayergroup.sharepoint.com/sites/005070/gestao_emergencia)
