export class SubMenu {

    constructor(http) {
        this.http = http;
    }

    async getSubMenuIcons() {

        let loader = await this.http.getData('/app/plugin/loader.json');
        let container = document.createElement('div');

        for (let plugin of loader.plugins) {

            let data = await this.http.getData(`${plugin.config}`);
            let module = null;
            let instance = null;

            //SET NSUBMENU BUTTONS
            if (data.subMenu && data.subMenu.id) {

                let btn = document.createElement('button');
                btn.setAttribute('id', `${data.subMenu.id}Btn`);
                btn.setAttribute('class', 'btn');

                let i = document.createElement('i');
                i.setAttribute('class', `${data.subMenu.icon}`);

                btn.appendChild(i);
                container.appendChild(btn);

                module = await import(data.module.path);
                instance = new module[data.module.name];

                //SET EVENT
                //document.querySelector(`#${data.subMenu.id}Btn`).addEventListener('click', (event) => { }, false);
            }
        }

        return container.outerHTML;
    }
}