export class Aside {

    constructor() {
        this.init();
    }

    init() { }

    async setPlugin(plugin) {
        let aside = document.querySelector('main aside');
        if (aside.firstChild) {
            aside.removeChild(aside.firstChild);
        }
        aside.insertAdjacentHTML("afterbegin", await plugin.render());
        await plugin.init();
    }
}