import { HttpFetch } from '../../js/core/HttpFetch.js';

export class FileExplorer {

    constructor() {
        this.http = new HttpFetch();
        this.events();
    }

    events() { }

    async render() {
        return await this.http.getTemplate('/app/plugin/FileExplorer/template.html');
    }

    async init() {

    }
}