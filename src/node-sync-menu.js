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
    /**
     * Changing title
     * @param {string} newTitle 
     */
    changeTitle(newTitle) {
        this.title = newTitle;
    }

    /**
     * Adding items
     * @param {string} title 
     * @param {async function} callback 
     */
    async addItem(title, callback) {
        this.items.push({title: title, callback: callback});
        this.quitNum = this.items.length + 1;
    }

    /**
     * Adding delimiter
     * @param {single character} character 
     * @param {int} num 
     * @param {string} text 
     * @param {int} row 
     */
    async addDelim(character, num=20, text="", row=null) {
        if (row === null) {
            this.delimiters.push({character: character, num: num, row: this.items.length, text: text});
        }
        else {
            this.delimiters.push({character: character, num: num, row: row, text: text});
        }
        this.quitNum = this.items.length + 1;
    }
    
    /**
     * Starting menu
     */
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
    
    async _printRows() {
        let delimIndex = 0;
        for (let i = 0; i < this.items.length; i++) {
            const element = this.items[i];
            if (this.delimiters[delimIndex] !== undefined && i === this.delimiters[delimIndex].row) {
                this._printDelim(this.delimiters[delimIndex]);
                delimIndex++;
            }
            console.log('|' + `${i+1}. ${element.title}`);
        }
    }
    
    _printDelim(delimiterObj) {
        let textToPrint = "";
        if (delimiterObj.num - 1 <= delimiterObj.text.length && delimiterObj.text.length !== 0) {
            textToPrint = delimiterObj.text;
        } 
        else if (delimiterObj.text.length) {
            let numChars = delimiterObj.num - delimiterObj.text.length;
            textToPrint = delimiterObj.character.repeat(numChars/2) + delimiterObj.text + delimiterObj.character.repeat(numChars/2);
        }
        else {
            textToPrint = delimiterObj.character.repeat(delimiterObj.num);
        }
        console.log('|' + textToPrint);
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


    async dispatch(choice) {
        await this.items[choice].callback();
    }

    async end() {
        process.exit();
    }
    
}

module.exports = new Menu();