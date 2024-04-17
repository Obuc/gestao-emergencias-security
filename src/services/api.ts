import axios from 'axios';

class CrudSharepoint {
  private baseUrl: string;
  private digestToken: string = '';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    document.addEventListener('DOMContentLoaded', async () => {
      this.digestToken = await this.getDigest();
      setInterval(async () => {
        this.digestToken = await this.getDigest();
      }, 60000);
    });
  }

  async getUserPhoto(email: string): Promise<string> {
    return `${this.baseUrl}/_layouts/15/userphoto.aspx?username=${email}`;
  }

  async postAllAttachments(list: string, id: string, input: Array<File>): Promise<any[]> {
    if (this.digestToken.length === 0) {
      this.digestToken = await this.getDigest();
    }

    if (input.length === 0) {
      throw new Error('Input inserido no parâmetro element não possui um arquivo');
    }

    const array: Promise<any>[] = [];

    for (const file of Array.from(input)) {
      const promise = new Promise(async (resolve, reject) => {
        const fileName = String(file.name).replace(/[^a-zA-Z0-9. ]/g, '');
        const reader = new FileReader();

        reader.readAsArrayBuffer(file);

        reader.onerror = () => {
          reject();
        };

        reader.onload = async (e) => {
          if (e.target) {
            try {
              const response = await axios.post(
                `${this.baseUrl}/_api/web/lists/GetByTitle('${list}')/items(${id})/AttachmentFiles/add(FileName='${fileName}')`,
                e.target.result,
                {
                  headers: {
                    Accept: 'application/json;odata=verbose',
                    'X-RequestDigest': this.digestToken,
                  },
                },
              );
              resolve(response.data.d);
            } catch (error) {
              reject(error);
            }
          }
        };
      });
      array.push(promise);
    }
    return Promise.all(array);
  }

  async getAllUsers({ url, userName }: { url: string; userName: string }): Promise<any[]> {
    try {
      const response = await axios.get(
        `${url}/_api/web/siteusers?$Select=*,Title&$top=15&$Filter=(substringof('${userName}',Title))`,
      );
      return response.data.value;
    } catch (error) {
      throw new Error('Erro ao obter os usuários.');
    }
  }

  async getPaged({ list, path, nextUrl }: { list?: string; path?: string; nextUrl?: string }): Promise<any> {
    const endUrl = path || '';
    const url = nextUrl || `${this.baseUrl}/_api/web/lists/GetByTitle('${list}')/items${endUrl}`;
    const resp = axios.get(url);
    return resp;
  }

  async getListItems(list: string, path: string = '', arrayResp: any[] = []): Promise<any[]> {
    try {
      const url = `${this.baseUrl}/_api/web/lists/GetByTitle('${list}')/items${path}`;
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json;odata=verbose',
        },
      });

      const responseData = response.data.d;

      if (arrayResp) {
        arrayResp = arrayResp.concat(responseData.results);
        if (responseData.__next) {
          const newPath = responseData.__next.substr(responseData.__next.indexOf('items?') + 5);
          return this.getListItems(list, newPath, arrayResp);
        } else {
          return arrayResp;
        }
      } else {
        const initialResponseArr = responseData.results;
        if (responseData.__next) {
          const newPath = responseData.__next.substr(responseData.__next.indexOf('items?') + 5);
          return this.getListItems(list, newPath, initialResponseArr);
        } else {
          return initialResponseArr;
        }
      }
    } catch (error) {
      throw new Error('Failed to get list items');
    }
  }

  async getListItemCount(listTitle: string) {
    try {
      const url = `${this.baseUrl}/_api/web/lists/GetByTitle('${listTitle}')?$select=ItemCount`;

      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json;odata=verbose',
        },
      });

      const itemCount = response.data.d.ItemCount;
      return itemCount;
    } catch (error) {
      throw new Error('Failed to get list item count');
    }
  }

  async getListItemsv2(list: string, path: string = ''): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const url = `${this.baseUrl}/_api/web/lists/GetByTitle('${list}')/items${path}`;
        const response = await axios.get(url, {
          headers: {
            Accept: 'application/json;odata=verbose',
          },
        });

        resolve(response.data.d);
      } catch (error) {
        reject(error);
      }
    });
  }

  async postItemList(list: string, data: any): Promise<any> {
    try {
      if (this.digestToken.length === 0) {
        this.digestToken = await this.getDigest();
      }

      const formattedListName = list
        .split('_')
        .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.substring(1) : word.toLowerCase()))
        .join('_x005f_');

      const listName = `${formattedListName}ListItem`;

      const dataToSend = {
        ...data,
        __metadata: {
          type:
            list === 'Valvulas_de_Governo'
              ? 'SP.Data.Valvulas_x005f_de_x005f_IncendioListItem'
              : list === 'Casa_de_Bombas'
              ? 'SP.Data.Casa_x005f_de_x005f_BombasListItem'
              : list === 'Bombas_de_Incendio'
              ? 'SP.Data.Bombas_x005f_de_x005f_IncendioListItem'
              : list === 'Alarmes_de_Incendio'
              ? 'SP.Data.Alarmes_x005f_de_x005f_IncendioListItem'
              : list === 'Operacao_OEI'
              ? 'SP.Data.Operacao_x005f_OEIListItem'
              : list === 'Portas_de_Emergencia'
              ? 'SP.Data.Portas_x005f_de_x005f_EmergenciaListItem'
              : `SP.Data.${listName}`,
        },
      };

      const url = `${this.baseUrl}/_api/web/lists/GetByTitle('${list}')/items`;
      const response = await axios.post(url, JSON.stringify(dataToSend), {
        headers: {
          'Content-Type': 'application/json;odata=verbose',
          Accept: 'application/json;odata=verbose',
          'X-RequestDigest': this.digestToken,
          'IF-MATCH': '*',
        },
      });

      return response.data.d;
    } catch (error) {
      throw error;
    }
  }

  async updateItemList(list: string, id: number, data: any): Promise<any> {
    try {
      if (this.digestToken.length === 0) {
        this.digestToken = await this.getDigest();
      }

      const formattedListName = list
        .split('_')
        .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.substring(1) : word.toLowerCase()))
        .join('_x005f_');

      const listName =
        list === 'Valvulas_de_Governo'
          ? 'Valvulas_x005f_de_x005f_IncendioListItem'
          : list === 'Casa_de_Bombas'
          ? 'Casa_x005f_de_x005f_BombasListItem'
          : list === 'Bombas_de_Incendio'
          ? 'Bombas_x005f_de_x005f_IncendioListItem'
          : list === 'Alarmes_de_Incendio'
          ? 'Alarmes_x005f_de_x005f_IncendioListItem'
          : list === 'Operacao_OEI'
          ? 'Operacao_x005f_OEIListItem'
          : list === 'Portas_de_Emergencia'
          ? 'Portas_x005f_de_x005f_EmergenciaListItem'
          : `${formattedListName}ListItem`;

      const url = `${this.baseUrl}/_api/web/lists/GetByTitle('${list}')/items(${id})`;

      const headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': this.digestToken,
        'IF-MATCH': '*',
        'X-HTTP-Method': 'MERGE',
      };

      const response = await axios.post(url, { ...data, __metadata: { type: `SP.Data.${listName}` } }, { headers });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteItemList(list: string, id: number): Promise<any> {
    try {
      let digestToken = '';
      if (digestToken.length === 0) {
        digestToken = await this.getDigest();
      }

      const requestOptions = {
        method: 'POST',
        url: `${this.baseUrl}/_api/web/lists/GetByTitle('${list}')/items(${id})/recycle()`,
        headers: {
          'Content-Type': 'application/json;odata=verbose',
          Accept: 'application/json;odata=verbose',
          'X-RequestDigest': digestToken,
          'IF-MATCH': '*',
          'X-HTTP-Method': 'DELETE',
        },
      };

      const response = await axios(requestOptions);

      if (typeof response.data !== 'object') {
        const responseData = JSON.parse(response.data);
        return responseData;
      } else {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async postAttachmentList(list: string, id: number, file: File): Promise<any> {
    try {
      if (this.digestToken.length === 0) {
        this.digestToken = await this.getDigest();
      }

      if (!file) {
        throw new Error('Input inserido no parametro element não possui um arquivo');
      }

      const fileName = file.name.replace(/[^a-zA-Z0-9. ]/g, '');
      const reader = new FileReader();

      const attachmentUrl = `${this.baseUrl}/_api/web/lists/GetByTitle('${list}')/items(${id})/AttachmentFiles/add(FileName='${fileName}')`;

      const headers = {
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': this.digestToken,
      };

      const response = await axios.post(attachmentUrl, reader.result, { headers });

      return response.data.d;
    } catch (error) {
      throw error;
    }
  }

  async deleteAttachmentList(list: string, id: number, filename: string): Promise<any> {
    try {
      if (this.digestToken.length === 0) {
        this.digestToken = await this.getDigest();
      }

      const encodedFilename = encodeURIComponent(filename);
      const attachmentUrl = `${this.baseUrl}/_api/web/lists/GetByTitle('${list}')/items(${id})/AttachmentFiles/getByFileName('${encodedFilename}')`;

      const headers = {
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': this.digestToken,
        'IF-MATCH': '*',
        'X-HTTP-Method': 'DELETE',
      };

      const response = await axios.post(attachmentUrl, null, { headers });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      const currentUserUrl = `${this.baseUrl}/_api/web/currentuser`;

      const headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
      };

      const response = await axios.get(currentUserUrl, { headers });
      return response.data.d;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUserMore(): Promise<any> {
    try {
      const userPropertiesUrl = `${this.baseUrl}/_api/SP.UserProfiles.PeopleManager/GetMyProperties?$select=*`;

      const headers = {
        Accept: 'application/json;odata=verbose',
      };

      const response = await axios.get(userPropertiesUrl, { headers });

      return response.data.d;
    } catch (error) {
      throw error;
    }
  }

  async getDepartment(userName: string): Promise<any> {
    try {
      const userProfilePropertyUrl = `${
        this.baseUrl
      }/_api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='Department')?@v='${encodeURIComponent(
        userName,
      )}'`;

      const headers = {
        Accept: 'application/json;odata=verbose',
      };

      const response = await axios.get(userProfilePropertyUrl, { headers });

      return response.data.d;
    } catch (error) {
      throw error;
    }
  }

  async getSpecifyUserMore(userName: string): Promise<any> {
    try {
      const userProfilePropertiesUrl = `${
        this.baseUrl
      }/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='${encodeURIComponent(userName)}'`;

      const headers = {
        Accept: 'application/json;odata=verbose',
      };

      const response = await axios.get(userProfilePropertiesUrl, { headers });

      return response.data.d;
    } catch (error) {
      throw error;
    }
  }

  async getSpecifyUserMoreV2(userName: string): Promise<any> {
    try {
      const siteUsersUrl = `${this.baseUrl}/_api/web/siteusers(@v)?@v='${encodeURIComponent(userName)}'`;

      const headers = {
        Accept: 'application/json;odata=verbose',
      };

      const response = await axios.get(siteUsersUrl, { headers });

      if (response.data.error) {
        return response.data;
      } else {
        return response.data.d;
      }
    } catch (error) {
      throw error;
    }
  }

  async getGroups(): Promise<any[]> {
    try {
      const groupsUrl = `${this.baseUrl}/_api/web/sitegroups`;

      const headers = {
        Accept: 'application/json;odata=verbose',
      };

      const response = await axios.get(groupsUrl, { headers });

      return response.data.d.results;
    } catch (error) {
      throw error;
    }
  }

  async getUsersGroup(idgroup: number): Promise<any[]> {
    try {
      const usersUrl = `${this.baseUrl}/_api/web/sitegroups/getbyid(${idgroup})/users`;

      const headers = {
        Accept: 'application/json;odata=verbose',
      };

      const response = await axios.get(usersUrl, { headers });

      return response.data.d.results;
    } catch (error) {
      throw error;
    }
  }

  async postUserToGroup(loginName: string, idgroup: number): Promise<any> {
    try {
      if (this.digestToken.length === 0) {
        this.digestToken = await this.getDigest();
      }

      const dataToSend = {
        __metadata: { type: 'SP.User' },
        LoginName: loginName,
      };

      const groupUsersUrl = `${this.baseUrl}/_api/web/sitegroups/GetById(${idgroup})/users`;

      const headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': this.digestToken,
      };

      const response = await axios.post(groupUsersUrl, JSON.stringify(dataToSend), { headers });

      return response.data.d.results;
    } catch (error) {
      throw error;
    }
  }

  async sendEmail(tolist: string[], cclist: string[], subject: string, body: string): Promise<any> {
    try {
      if (this.digestToken.length === 0) {
        this.digestToken = await this.getDigest();
      }

      const dataToSend = {
        properties: {
          To: {
            results: tolist,
          },
          CC: {
            results: cclist,
          },
          Subject: subject,
          Body: body,
          AdditionalHeaders: {
            results: [
              {
                __metadata: {
                  type: 'SP.KeyValue',
                },
                Key: 'content-type',
                Value: 'text/html',
                ValueType: 'Edm.String',
              },
            ],
          },
        },
      };

      (dataToSend.properties as any).__metadata = {
        type: 'SP.Utilities.EmailProperties',
      };

      const sendEmailUrl = `${this.baseUrl}/_api/SP.Utilities.Utility.SendEmail`;

      const headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': this.digestToken,
        contentType: 'application/json',
      };

      const response = await axios.post(sendEmailUrl, JSON.stringify(dataToSend), { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  private async getDigest(): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/_api/contextinfo`, null, {
        headers: {
          Accept: 'application/json;odata=verbose',
        },
      });

      const digestToken = response.data.d.GetContextWebInformation.FormDigestValue;
      return digestToken;
    } catch (error) {
      throw error;
    }
  }
}

export default CrudSharepoint;
