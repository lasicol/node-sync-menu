const readline = require("readline-sync");

const EXAMPLE_MENU = "\
 _____       _        _____                _____             \n\
|   | |___ _| |___   |   __|_ _ ___ ___   |     |___ ___ _ _ \n\
| | | | . | . | -_|  |__   | | |   |  _|  | | | | -_|   | | |\n\
|_|___|___|___|___|  |_____|_  |_|_|___|  |_|_|_|___|_|_|___|\n\
                           |___|                             \n"


class Menu {
    constructor() {
        this.title = EXAMPLE_MENU;
        this.items = [];
        this.delimiters = [];
        this.quitNum = 0;
    }

    changeTitle(newTitle) {
        this.title = newTitle;
    }

    async addItem(title, callback) {
        this.items.push({title: title, callback: callback});
        this.quitNum = this.items.length + 1;
    }

    async addDelim(character, num=20, row=null) {
        if (row === null) {
            this.delimiters.push({character: character, num: num, row: this.items.length});
        }
        else {
            this.delimiters.push({character: character, num: num, row: row});
        }
        this.quitNum = this.items.length + 1;
    }

    async _printRows() {
        let delimIndex = 0;
        for (let i = 0; i < this.items.length; i++) {
            const element = this.items[i];
            if (this.delimiters[delimIndex] !== undefined && i === this.delimiters[delimIndex].row) {
                console.log('|' + this.delimiters[delimIndex].character.repeat(this.delimiters[delimIndex].num));
                delimIndex++;
            }
            console.log('|' + `${i+1}. ${element.title}`);
        }
    }
    
    async showMenu() {
        console.log('\x1Bc');
        console.log(this.title + "\n");
        console.log(" " + "-".repeat(20));
        await this._printRows();
        console.log(" " + "-".repeat(20));
        console.log(" " + `${this.items.length + 1}. Quit`);
        console.log('');
    }

    async start() {
        let end = false;
        while(!end) {
            await this.showMenu();
            let choice = readline.question("> ");
            if (choice == this.quitNum) {
                await this.end();
            }
            await this.dispatch(parseInt(choice) - 1);
            
            readline.question("Press Enter to continue");
        }
    }

    async dispatch(choice) {
        await this.items[choice].callback();
    }

    async end() {
        process.exit();
    }
    
}

module.exports = new Menu();