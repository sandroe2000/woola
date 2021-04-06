import Split from '../node_modules/split.js/dist/split.es.js';

export class Editor {

    constructor() {
        this.editor;
        this.events();
        this.co = 0;
    }

    events() {

        document.querySelector('#wwFileMenuNewHtml').addEventListener('click', (event) => {

            ++this.co;

            let li = document.createElement('li');
            li.setAttribute('class', 'nav-item');
            li.setAttribute('role', 'presentation');

            let button = document.createElement('button');
            button.setAttribute('class', 'nav-link active');
            button.setAttribute('id', `id${this.co}-tab`);
            button.setAttribute('data-bs-toggle', 'tab');
            button.setAttribute('data-bs-target', `id${this.co}`);
            button.setAttribute('type', 'button');
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-controls', `id${this.co}`);
            button.setAttribute('aria-selected', 'true');

            let label = document.createTextNode(`id${this.co}`);

            button.appendChild(label);
            li.appendChild(button);

            let container = document.createElement('div');
            container.setAttribute('class', 'tab-pane fade show active');
            container.setAttribute('id', `id${this.co}`);
            container.setAttribute('role', 'tabpanel');
            container.setAttribute('aria-labelledby', `id${this.co}-tab`);

            let visual = document.createElement('div');
            visual.setAttribute('class', 'split-top');
            visual.setAttribute('id', 'containerVisual');

            let code = document.createElement('div');
            code.setAttribute('class', 'split-bottom');
            code.setAttribute('id', 'containerCode');

            container.appendChild(visual);
            container.appendChild(code);

            document.querySelector('#wwTab').appendChild(li);
            document.querySelector('#wwTabContent').appendChild(container);

            this.setSplitPanel();

        }, false);
    }

    setSplitPanel() {

        //TODO: PESQUISAR BIND...
        let that = this;

        Split(['#containerVisual', '#containerCode'], {
            direction: 'vertical',
            gutterSize: 6,
            onDragEnd: function () {
                that.resize();
            }
        });

        this.setMonaEditor('#containerCode')
    }

    setMonaEditor(id) {
        require(['vs/editor/editor.main'], () => {
            this.editor = monaco.editor.create(document.querySelector(id), {
                value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
                language: 'javascript',
                minimap: {
                    enabled: false
                }
            });

            monaco.editor.setTheme('vs');

            window.onresize = () => {
                if (this.editor) {
                    this.editor.layout();
                }
            };
        });
    }

    resize() {
        this.editor.layout();
    }
}

document.addEventListener("DOMContentLoaded", () => new Editor());