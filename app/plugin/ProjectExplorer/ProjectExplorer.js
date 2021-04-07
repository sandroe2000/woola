import { HttpFetch } from '../../js/core/HttpFetch.js';

export class ProjectExplorer {

    constructor(app) {
        this.app = app;
        this.http = new HttpFetch();
    }

    async render() {
        return await this.http.getTemplate('/app/plugin/ProjectExplorer/template.html');
    }

    async init() {
        let value = await this.http.getTemplate('/app/plugin/ProjectExplorer/treeView.html');
        await this.setContainerValue(value);
        this.events();
    }

    events() {
        document.querySelector('#projectExplorerNavNewFile').addEventListener('click', async (event) => {
            let value = await this.http.getTemplate('/app/plugin/ProjectExplorer/newFile.html');
            await this.setContainerValue(value);

            document.querySelectorAll('#projectExplorerNewFileList div.card').forEach(element => {
                element.addEventListener('click', (event) => {

                    let i = 0;
                    let file = [
                        {
                            id: `html-${this.app.util.uuidv4()}`,
                            extension: 'html',
                            title: 'Untitled.html',
                            content: `<h1>Haaaaaaaaaaaa</h1>`
                        }, {
                            id: `css-${this.app.util.uuidv4()}`,
                            extension: 'css',
                            title: 'Untitled.css'
                        }, {
                            id: `js-${this.app.util.uuidv4()}`,
                            extension: 'js',
                            title: 'Untitled.js'
                        }
                    ];

                    //-> QUICK FIX
                    if (element.getAttribute('id').indexOf('Html') > -1) {
                        i = 0;
                    }
                    if (element.getAttribute('id').indexOf('Css') > -1) {
                        i = 1;
                    }
                    if (element.getAttribute('id').indexOf('Js') > -1) {
                        i = 2;
                    }

                    this.app.wwSetFile(file[i]);
                }, false);
            });

        }, false);

        document.querySelector('#projectExplorerNavOpen').addEventListener('click', async (event) => {
            console.log('Open.....')
        }, false);

        document.querySelector('#projectExplorerNavBack').addEventListener('click', async (event) => {
            let value = await this.http.getTemplate('/app/plugin/ProjectExplorer/treeView.html');
            await this.setContainerValue(value);
        }, false);
    }

    async setContainerValue(value) {
        let container = document.querySelector('#projectExplorerContainer');
        if (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.insertAdjacentHTML("afterbegin", value);
    }
}