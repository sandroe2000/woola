import { Aside } from './Aside.js'

export class Nav {

    constructor(http) {
        this.http = http;
        this.aside = new Aside();
        this.events();
        this.init();
    }

    events() {
        document.querySelector('#btnToggleAside').addEventListener('click', (event) => {
            document.querySelector('aside').classList.toggle('hide');
            document.querySelector('#btnToggleAside i').classList.toggle('fa-angle-double-right');
        }, false);
    }

    async init() {

        let loader = await this.http.getData('/app/plugin/loader.json');
        let isFirstPlugin = true;
        let that = this;

        for (let plugin of loader.plugins) {

            let data = await this.http.getData(`${plugin.config}`);
            let module = null;
            let instance = null;

            //SET NAV BUTTONS
            if (data.nav && data.nav.id) {

                let btn = document.createElement('button');
                btn.setAttribute('id', `${data.nav.id}Nav`);
                btn.setAttribute('class', 'btn');

                let i = document.createElement('i');
                i.setAttribute('class', `${data.nav.icon}`);

                btn.appendChild(i);
                document.querySelector('main nav').appendChild(btn);

                module = await import(data.module.path);
                instance = new module[data.module.name];

                //SET EVENT CLICK
                document.querySelector(`#${data.nav.id}Nav`).addEventListener('click', (event) => {
                    that.aside.setPlugin(instance);
                    if (document.querySelector('aside').classList.contains('hide')) {
                        document.querySelector('#btnToggleAside').click();
                    }
                }, false);
            }

            //SET LIST FIRST PLUGIN IN ASIDE
            if (isFirstPlugin) {
                this.aside.setPlugin(instance);
                isFirstPlugin = false;
            }
        }
    }
}