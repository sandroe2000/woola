import { Util } from './Util.js';

export class HttpFetch {

  constructor() {
    this.util = new Util();
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  async postData(url, data) {
    const response = await fetch(url+`?random=${this.util.uuidv4()}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });

    return await response.json();
  }
  
  async getData(url) {
    const response = await fetch(url+`?random=${this.util.uuidv4()}`, {
      method: 'GET',
      headers: this.headers
    });
    return await response.json();
  }

  async getTemplate(url) {
    const response = await fetch(url+`?random=${this.util.uuidv4()}`, {
      method: 'GET',
      headers: this.headers
    });
    return await response.text();
  }
}