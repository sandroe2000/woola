import { HttpFetch } from '../../js/core/HttpFetch.js';

export class EntityMannager {

    constructor(app) {
        this.app = app;
        this.http = new HttpFetch();
        this.events();
    }

    events() { }

    async render() {
        return await this.http.getTemplate('/app/plugin/EntityMannager/template.html');
    }

    async init() {

    }
}