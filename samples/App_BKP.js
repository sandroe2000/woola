import '/node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import { HttpFetch } from './core/HttpFetch.js';
import { Util } from './core/Util.js';
import { Nav } from './Nav.js';
import { Section } from './Section.js';

export class App {

    constructor() {
        this.http = new HttpFetch();
        this.util = new Util();
        this.nav = new Nav(this.http);
        this.section = new Section(this.http, this.util);
    }
}

document.addEventListener("DOMContentLoaded", () => new App());