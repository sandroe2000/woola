import { SubMenu } from "./SubMenu.js";
import Split from '../../node_modules/split.js/dist/split.es.js';

export class Section {

    constructor(http, util) {

        this.http = http;
        this.util = util;
        this.tabHistory = [{ id: 'wellcome-tab', counter: 0 }];
        this.HistoryCounter = 0;
        this.init();
        this.events();
    }

    async init() {

        let main = document.querySelector('main section');
        main.insertAdjacentHTML("afterbegin", await this.render());
    }

    async render() {

        //return await this.http.getTemplate('/app/template/Section.html');
        return `<div>
                    <ul class="nav nav-tabs" id="sectionTab" role="tablist"></ul>
                    <div class="tab-content" id="sectionTabContent"></div>
                </div>`;
    }

    events() {

        document.querySelector('#fileMenuNewHtml').addEventListener('click', (event) => {
            let file = { id: `html-${this.util.uuidv4()}`, extension: 'html', title: 'Untitled.html' };
            this.setFile(file);
        }, false);

        document.querySelector('#fileMenuNewJs').addEventListener('click', (event) => {
            let file = { id: `js-${this.util.uuidv4()}`, extension: 'js', title: 'Untitled.js' };
            this.setFile(file);
        }, false);

        document.querySelector('#fileMenuNewCss').addEventListener('click', (event) => {
            let file = { id: `css-${this.util.uuidv4()}`, extension: 'css', title: 'Untitled.css' };
            this.setFile(file);
        }, false);
    }

    setMonaEditor(id) {
        require(['vs/editor/editor.main'], () => {
            monaco.editor.create(document.querySelector(id), {
                value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
                language: 'javascript'
            });
        });
    }

    async setFile(file) {

        let panelContent = `<div class="full-panel" id="${file.id}Code"></div>`
        if (file.extension == 'html') {
            panelContent = `<div class="split-top" id="${file.id}Visual"></div>
                            <div class="split-bottom" id="${file.id}Code"></div>`;
        }

        let tab = `<li class="nav-item" id="${file.id}-li" role="presentation">
                        <button class="nav-link" id="${file.id}-tab" data-bs-toggle="tab" data-bs-target="#${file.id}"
                            type="button" role="tab" aria-controls="${file.id}" aria-selected="true">
                            <span style="margin-right: 5px;"><img src="/assets/images/${file.extension}.png" height="16" /></span>
                            ${file.title}
                            <div class="close" style="margin-left: 5px;"><i class="fa fa-times-circle"></i></div>
                        </button>
                    </li>`;
        let pane = `<div class="tab-pane fade" id="${file.id}" role="tabpanel" aria-labelledby="${file.id}-tab">
                        <div class="menu-html">
                            ${await this.getSubMenu(file)}
                        </div>
                        <div class="split">
                        ${panelContent}
                        </div>
                    </div>`;

        document.querySelector('#sectionTab').insertAdjacentHTML("beforeend", tab);
        document.querySelector('#sectionTabContent').insertAdjacentHTML("beforeend", pane);

        if (file.extension == 'html') {
            this.setSplitPanel(file);
        }

        this.addTabHistory(`${file.id}-tab`);

        document.querySelector(`#${file.id}-tab`).addEventListener('click', (event) => {
            event.stopPropagation();
            this.setTabHistory(`${file.id}-tab`);
        }, false);

        document.querySelector(`#${file.id}-tab .close`).addEventListener('click', (event) => {
            event.preventDefault();
            //TODO -> VERIFY LAST CHANGE HAS SAVED
            this.closeTab(file.id);
            event.stopPropagation();
        }, false);

        document.querySelector(`#${file.id}-tab`).click();
    }

    setSplitPanel(file) {
        Split([`#${file.id}Visual`, `#${file.id}Code`], {
            direction: 'vertical',
            gutterSize: 6
        });

        this.setMonaEditor(`#${file.id}Code`);
    }

    closeTab(id) {

        document.querySelector('#sectionTab').removeChild(document.querySelector(`#${id}-li`));
        document.querySelector('#sectionTabContent').removeChild(document.querySelector(`#${id}`));
        this.removeTabHistory(`${id}-tab`);
    }

    //LOAD HTML DRAG N DROP PLUGIN
    async getSubMenu(file) {

        let retorno = '';

        if (file.extension == 'html') {

            let subMenu = new SubMenu(this.http);
            retorno = await subMenu.getSubMenuIcons();
        }

        return retorno;
    }

    addTabHistory(id) {

        this.tabHistory.push({ id: id, counter: 0 });
    }

    removeTabHistory(id) {

        this.tabHistory = this.tabHistory.filter(element => element.id != id);
        let lastBeforeRemoved = this.getTabLastFocus(`${id}-tab`);

        if (document.querySelector('#sectionTab').children.length > 0) {
            document.querySelector(`#${lastBeforeRemoved}`).click();
        }
    }

    setTabHistory(id) {

        this.tabHistory.forEach(element => {
            if (element.id == id) {
                element.counter = ++this.HistoryCounter;
            }
        });
    }

    getTabLastFocus() {

        let counter = 0;
        let obj = {};

        this.tabHistory.forEach(element => {
            if (element.counter >= counter) {
                counter = element.counter;
                obj = element;
            }
        });

        return obj.id;
    }
}