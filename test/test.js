const menu = require('../src/Menu');
const readline = require('readline-sync');

menu.addItem("Give your name and feedback", async () => {
    let name = readline.question("What is your name?[unknown]: ", {
        defaultInput: "unknown"
    });
    let comment = readline.question("What is your comment?[]: ", {
        defaultInput: ""
    });
    console.log(name + " commnet: " + comment);
});
menu.addDelim("=");
menu.addItem("Do nothing1", async () => {});
menu.addItem("Do nothing2", async () => {});
menu.start();