//const Promise = require("bluebird");
//const fetch = require("node-fetch");
//fetch.Promise = Promise;
const fs = require("fs");
const {EventEmitter} = require("events");
const puppeteer = require('puppeteer');

const main = async () =>{
    const write = fs.createWriteStream(`${__dirname}/stats.txt`);
    let browser = await puppeteer.launch({headless: true});
    let page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080})
    const qual = 'https://www.racefactorygaming.com/Events/Event?event=750';
    await page.goto(qual);
    await page.waitForTimeout(2000);
    fs.appendFile(`${__dirname}/stats.txt`, `[color=#0080BF][u][b]Top 10 Qualifiers[/b][/u][/color]\n\n[b][u]250 East Supercross[/b][/u]\n`, 'utf8', () =>{});

    let qualifying = await page.evaluate(() =>{
        let position = document.querySelectorAll(`#DataTables_Table_4 > tbody > tr:nth-child(1) > td.sorting_1`);
        let number = document.querySelector(`#DataTables_Table_4 > tbody > tr:nth-child(1)`).querySelectorAll("td");
        let name = document.querySelectorAll(`#DataTables_Table_4 > tbody > tr:nth-child(1) > td.clickable-row`);
        let qualTime = document.querySelector(`#DataTables_Table_4 > tbody > tr:nth-child(1)`).querySelectorAll("td");
        let qualArray = [];

        for (let i = 0;i<10;i++){
            qualArray[i] = {
                position: position[i].innerText,
                number: number[i].innerText,
                name: name[i].innerText,
                qualTime: qualTime[i].innerText
            }
        }

        return {qualArray};
    });

    for (let i = 1;i<11;i++){
        await fs.appendFile(`${__dirname}/stats.txt`, `1. [i][size=85]#${JSON.stringify(qualifying.qualArray[i])}[/size][/i] - ${qualifying.name} | \n`, 'utf8', ()=>{});
    }



    const h1_250 = '';
    const h2_250 = '';
    const h1_450 = '';
    const h2_450 = '';
    const lcq_250 = '';
    const lcq_450 = '';
    const main_250 = '';
    const main_450 = '';




await browser.close();
}

main();