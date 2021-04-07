import Split from '../../node_modules/split.js/dist/split.es.js';
import { HttpFetch } from './core/HttpFetch.js';
import { Util } from './core/Util.js';


export class App {

    constructor() {
        this.http = new HttpFetch();
        this.util = new Util();
        this.wwTabHistory = [{ id: 'wellcome-tab', counter: 0 }];
        this.wwHistoryCounter = 0;
        this.wwEditor = [];
        this.wwEditorTheme = 'vs';
        this.events();
        this.init();
    }

    events() {
        //-> NAV
        document.querySelector('#btnToggleAside').addEventListener('click', (event) => {
            document.querySelector('aside').classList.toggle('hide');
            document.querySelector('#btnToggleAside i').classList.toggle('fa-angle-double-right');
        }, false);
        //-> SECTION
        document.querySelector('#wwFileMenuNewHtml').addEventListener('click', (event) => {
            let file = { id: `html-${this.util.uuidv4()}`, extension: 'html', title: 'Untitled.html', content: `<h1>Haaaaaaaaaaaa</h1>` };
            this.wwSetFile(file);
        }, false);

        document.querySelector('#wwFileMenuNewJs').addEventListener('click', (event) => {
            let file = { id: `js-${this.util.uuidv4()}`, extension: 'js', title: 'Untitled.js' };
            this.wwSetFile(file);
        }, false);

        document.querySelector('#wwFileMenuNewCss').addEventListener('click', (event) => {
            let file = { id: `css-${this.util.uuidv4()}`, extension: 'css', title: 'Untitled.css' };
            this.wwSetFile(file);
        }, false);

        //MENU -> VIEW
        document.querySelector('#wwViewDarkMode').addEventListener('click', (event) => {
            if (document.querySelector('#wwViewDarkMode').checked) {
                this.setOnDarkmode();
            } else {
                this.setOffDarkmode();
            }
        }, false);
    }

    async init() {

        //-> NAV
        this.wwLoadNav();

        //-> SECTION
        let main = document.querySelector('main section');
        main.insertAdjacentHTML("afterbegin", await this.wwRender());
    }

    setOnDarkmode() {

        let root = document.documentElement;
        root.style.setProperty('--fontColor', '#FFFFFF');
        root.style.setProperty('--bgBody', '#212529');
        root.style.setProperty('--bgPanel', '#323232');
        root.style.setProperty('--bgMain', '#2D2D2D');
        root.style.setProperty('--btHover', '#3A3A3A');
        root.style.setProperty('--bgWrite', '#707070');

        this.wwEditorTheme = 'vs-dark';
        if (typeof monaco != "undefined") monaco.editor.setTheme(this.wwEditorTheme);
    }

    setOffDarkmode() {

        let root = document.documentElement;
        root.style.setProperty('--fontColor', '#212529');
        root.style.setProperty('--bgBody', '#B0B0B0');
        root.style.setProperty('--bgPanel', '#EDEDED');
        root.style.setProperty('--bgMain', '#F7F7F7');
        root.style.setProperty('--btHover', '#F7F7F7');
        root.style.setProperty('--bgWrite', '#FFFFFF');

        this.wwEditorTheme = 'vs';
        if (typeof monaco != "undefined") monaco.editor.setTheme(this.wwEditorTheme);
    }

    async wwRender() {

        //return await this.http.getTemplate('/app/template/Section.html');
        return `<div>
                   <ul class="nav nav-tabs" id="sectionTab" role="tablist"></ul>
                    <div class="tab-content" id="sectionTabContent"></div>
                </div>`;
    }

    async wwLoadNav() {
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
                instance = new module[data.module.name](this);

                //SET EVENT CLICK
                document.querySelector(`#${data.nav.id}Nav`).addEventListener('click', (event) => {
                    that.wwSetPlugin(instance);
                    if (document.querySelector('aside').classList.contains('hide')) {
                        document.querySelector('#btnToggleAside').click();
                    }
                }, false);
            }

            //SET LIST FIRST PLUGIN IN ASIDE
            if (isFirstPlugin) {
                this.wwSetPlugin(instance);
                isFirstPlugin = false;
            }
        }
    }

    wwSetMonacoEditor(id, ext, content) {

        if (document.querySelector(`${id} div.monaco-editor`)) {
            return false;
        }

        require(['vs/editor/editor.main'], () => {

            let i = 0;
            if (this.wwEditor.length) { i = this.wwEditor.length; }

            this.wwEditor[i] = monaco.editor.create(document.querySelector(id), {
                minimap: {
                    enabled: false,
                },
                automaticLayout: true
            });

            monaco.editor.setTheme(this.wwEditorTheme);

            switch (ext) {
                case 'js':
                    if (!content) {
                        content = "export class Untitled{\n\tconstructor(){ }\n}";
                    }
                    ext = 'javascript';
                    break;
                case 'css':
                    if (!content) {
                        content = "/*** CSS3 ***/\nx {\n\twidth: 100%;\n}";
                    }
                    break;
                case 'html':
                    if (!content) {
                        content = "<!-- HTML5 -->";
                    }
                    break;
            }

            const model = monaco.editor.createModel(content, ext);
            this.wwEditor[i].setModel(model);
        });
    }

    async wwSetFile(file) {


        let wwPanelContent = `<div class="ww-full-panel" id="${file.id}Code"></div>`;

        if (file.extension == 'html') {
            wwPanelContent = `<div class="ww-split">
                                    <div class="ww-split-top" id="${file.id}Visual"></div>
                                    <div class="ww-split-bottom" id="${file.id}Code"></div>
                              </div>`;
        }

        let wwTab = `<li class="nav-item" id="${file.id}-li" role="presentation">
                        <button class="nav-link" id="${file.id}-tab" data-bs-toggle="tab" data-bs-target="#${file.id}"
                            type="button" role="tab" aria-controls="${file.id}" aria-selected="true">
                            <span style="margin-right: 5px;"><img src="/assets/icons/${file.extension}.svg" height="20" width="20" /></span>
                            ${file.title}
                            <div class="close" style="margin-left: 5px; visibility: hidden"><i class="fa fa-times-circle"></i></div>
                        </button>
                    </li>`;
        let wwPane = `<div class="tab-pane fade" id="${file.id}" role="tabpanel" aria-labelledby="${file.id}-tab">
                        <div class="menu-html">
                            ${await this.wwGetSubMenu(file)}
                        </div>                        
                        ${wwPanelContent}                        
                    </div>`;

        document.querySelector('#sectionTab').insertAdjacentHTML("beforeend", wwTab);
        document.querySelector('#sectionTabContent').insertAdjacentHTML("beforeend", wwPane);

        if (file.extension == 'html') {
            await this.wwSetSplitPanel(file);
        }

        this.wwAddTabHistory(`${file.id}-tab`);

        //-> THIS EVENT IS FIRED ONLY ONE TIME, THEN IS REMOVED -> { once: true }
        document.querySelector(`#${file.id}-tab`).addEventListener('shown.bs.tab', async (event) => {
            this.wwSetMonacoEditor(`#${file.id}Code`, file.extension, file.content);
        }, { once: true });

        document.querySelector(`#${file.id}-tab`).addEventListener('mouseover', (event) => {
            this.showTabCloseIcon(document.querySelector(`#${file.id}-tab div.close`));
        }, false);
        document.querySelector(`#${file.id}-tab`).addEventListener('mouseout', (event) => {
            this.hideTabCloseIcon(document.querySelector(`#${file.id}-tab div.close`));
        }, false);

        document.querySelector(`#${file.id}-tab`).addEventListener('click', (event) => {
            event.preventDefault();
            this.wwSetTabHistory(`${file.id}-tab`);
            event.stopPropagation();
        }, false);

        document.querySelector(`#${file.id}-tab .close`).addEventListener('click', async (event) => {
            //TODO: VERIFY LAST CHANGE HAS SAVED
            event.preventDefault();
            event.stopPropagation();
            this.wwCloseTab(file.id);
        }, false);

        document.querySelector(`#${file.id}-tab`).click();
    }

    showTabCloseIcon(tab) {
        tab.style.visibility = 'visible';
    }

    hideTabCloseIcon(tab) {
        tab.style.visibility = 'hidden';
    }

    async wwSetSplitPanel(file) {

        let that = this;

        Split([`#${file.id}Visual`, `#${file.id}Code`], {
            direction: 'vertical',
            gutterSize: 6,
            sizes: [50, 50]
        });
    }

    wwCloseTab(id) {

        //TODO: REMOVE FROM "this.wwEditor[]"
        //TODO: Distroy monaco-editor
        document.querySelector('#sectionTab').removeChild(document.querySelector(`#${id}-li`));
        document.querySelector('#sectionTabContent').removeChild(document.querySelector(`#${id}`));
        this.wwRemoveTabHistory(`${id}-tab`);
    }

    //LOAD HTML DRAG N DROP PLUGIN
    async wwGetSubMenu(file) {

        let retorno = '';

        if (file.extension == 'html') {

            retorno = await this.wwGetSubMenuIcons();
        }

        return retorno;
    }

    wwAddTabHistory(id) {

        this.wwTabHistory.push({ id: id, counter: 0 });
    }

    wwRemoveTabHistory(id) {

        this.wwTabHistory = this.wwTabHistory.filter(element => element.id != id);
        let lastBeforeRemoved = this.wwGetTabLastFocus(`${id}-tab`);

        if (document.querySelector('#sectionTab').children.length > 0) {
            document.querySelector(`#${lastBeforeRemoved}`).click();
        }
    }

    wwSetTabHistory(id) {

        this.wwTabHistory.forEach(element => {
            if (element.id == id) {
                element.counter = ++this.wwHistoryCounter;
            }
        });
    }

    wwGetTabLastFocus() {

        let counter = 0;
        let obj = {};

        this.wwTabHistory.forEach(element => {
            if (element.counter >= counter) {
                counter = element.counter;
                obj = element;
            }
        });

        return obj.id;
    }

    //-> ASIDE
    async wwSetPlugin(plugin) {

        let aside = document.querySelector('main aside');
        if (aside.firstChild) {
            aside.removeChild(aside.firstChild);
        }
        aside.insertAdjacentHTML("afterbegin", await plugin.render());
        await plugin.init();
    }

    //-> SUBMENU
    async wwGetSubMenuIcons() {

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

document.addEventListener("DOMContentLoaded", () => new App());