const puppeteer = require('puppeteer');
const fs = require('fs');
const qualurl = 'https://www.racefactorygaming.com/Events/Event?event=726';
//const h1_250url = 'http://mxsimulator.com/servers/official.mxslobby.com:19801/races/8352.html';


const main = async () =>{
    await qual250();
    await qual450();
    console.log("Qualifying Done");

    fs.appendFileSync(`${__dirname}/stats.txt`, `\n[b][u]Heat Results[/b][/u]\n`)
    await heats("250 East", "1", 'http://mxsimulator.com/servers/official.mxslobby.com:19801/races/8352.html');
    await heats("250 East", "2", 'http://mxsimulator.com/servers/official.mxslobby.com:19801/races/8353.html');
    console.log("250 Heats Done");
    await heats("450", "1", 'http://mxsimulator.com/servers/official.mxslobby.com:19801/races/8354.html');
    await heats("450", "2", 'http://mxsimulator.com/servers/official.mxslobby.com:19801/races/8355.html');
    console.log("450 Heats Done");


    fs.appendFileSync(`${__dirname}/stats.txt`, `\n[b][u]LCQ Results[/b][/u]\n`)
    await lcq("250", 'http://mxsimulator.com/servers/official.mxslobby.com:19801/races/8356.html');
    await lcq("450", 'http://mxsimulator.com/servers/official.mxslobby.com:19801/races/8357.html');
    console.log("LCQs Done");

    fs.appendFileSync(`${__dirname}/stats.txt`, `\n[b][u]Main Results[/b][/u]\n`)
    await mains("250", 'http://mxsimulator.com/servers/official.mxslobby.com:19801/races/8356.html');
    await mains("450", 'http://mxsimulator.com/servers/official.mxslobby.com:19801/races/8357.html');
    console.log("Mains Done");

    fs.appendFileSync(`${__dirname}/stats.txt`, `\n[b][u]Top 20 in Points[/b][/u]\n`);
    await points250w();
    await points250e();
    await points450();
    console.log("Points Done");

}

main().then(r => {});

async function qual250(){
    let browser = await puppeteer.launch({headless: true});
    let page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080})
    await page.goto(qualurl);
    await page.waitForTimeout(2000);
    fs.writeFile(`${__dirname}/stats.txt`, `[url=${qualurl}][color=#0080BF][b]Top 10 Qualifiers[/b][/color][/url]\n\n[b][u]250 Supercross[/b][/u]\n`, 'utf8', () =>{});

    let qualifying = await page.evaluate(() =>{
        function capitalize(str) {
            return str.replace(
                /\w\S*/g,
                function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }
        let numberArray = [];
        let nameArray = [];
        let timeArray = [];
        for(let i=0;i<10;i++){
            numberArray[i] = document.querySelector(`#DataTables_Table_4 > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(2)`).innerHTML;
            nameArray[i] = capitalize(document.querySelector(`#DataTables_Table_4 > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(4)`).innerHTML);
            timeArray[i] = document.querySelector(`#DataTables_Table_4 > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(5)`).innerHTML;
        }
        return {numberArray, nameArray, timeArray};
    });
    for(let j = 0; j<10;j++){
        fs.appendFileSync(`${__dirname}/stats.txt`, `${j+1}. [i][size=85]#${qualifying.numberArray[j]}[/size][/i] - ${qualifying.nameArray[j]} | [size=85][color=#FF0000]Team[/color][/size] - [size=85][i]${qualifying.timeArray[j]}[/i][/size]\n`)
    }
    await browser.close();
}

async function qual450(){
    let browser = await puppeteer.launch({headless: true});
    let page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080})
    await page.goto(qualurl);
    await page.waitForTimeout(2000);
    fs.appendFileSync(`${__dirname}/stats.txt`, `\n[b][u]450 Supercross[/b][/u]\n`);

    let qualifying = await page.evaluate(() =>{
        function capitalize(str) {
            return str.replace(
                /\w\S*/g,
                function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }
        let numberArray = [];
        let nameArray = [];
        let timeArray = [];
        for(let i=0;i<10;i++){
            numberArray[i] = document.querySelector(`#DataTables_Table_3 > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(2)`).innerHTML;
            nameArray[i] = capitalize(document.querySelector(`#DataTables_Table_3 > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(4)`).innerHTML);
            timeArray[i] = document.querySelector(`#DataTables_Table_3 > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(5)`).innerHTML;
        }
        return {numberArray, nameArray, timeArray};
    });
    for(let j = 0; j<10;j++){
        fs.appendFileSync(`${__dirname}/stats.txt`, `${j+1}. [i][size=85]#${qualifying.numberArray[j]}[/size][/i] - ${qualifying.nameArray[j]} | [size=85][color=#FF0000]Team[/color][/size] - [size=85][i]${qualifying.timeArray[j]}[/i][/size]\n`)
    }
    await browser.close();
}

async function heats(title, num, url){
    let browser = await puppeteer.launch({headless: true});
    let page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080})
    await page.goto(url);
    await page.waitForTimeout(2000);
    fs.appendFileSync(`${__dirname}/stats.txt`, `\n[b][u]${title} Supercross Heat ${num}[/b][/u]\n`);

    let results = await page.evaluate(() =>{
        function capitalize(str) {
            return str.replace(
                /\w\S*/g,
                function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1);
                }
            );
        }

        let position = document.querySelectorAll(`td.pos`);
        let numberArray = [];
        let nameArray = [];
        let posNum = position.length;

        for(let i=0;i<position.length;i++){
            numberArray[i] = document.querySelector(`table.laptimes:nth-child(5) > tbody:nth-child(1) > tr:nth-child(${i+2}) > td:nth-child(2)`).innerHTML;
            nameArray[i] = capitalize(document.querySelector(`table.laptimes:nth-child(5) > tbody:nth-child(1) > tr:nth-child(${i+2}) > td:nth-child(3) > a:nth-child(1)`).innerHTML);
        }
        return {numberArray, nameArray, posNum};
    });

    for(let j = 0; j<results.posNum;j++){
        if(j<9){
            let helper = results.nameArray[j];
            let n = helper.includes("|");
            if(!n){
                fs.appendFileSync(`${__dirname}/stats.txt`, `[color=#00BF00]${j+1}.[/color] [i][size=85]#${results.numberArray[j]}[/size][/i] ${helper}\n`)
            } else {
                let name = helper.substring(0,helper.indexOf("|"));
                let team = helper.substring(helper.indexOf("|")+1);
                fs.appendFileSync(`${__dirname}/stats.txt`, `[color=#00BF00]${j+1}.[/color] [i][size=85]#${results.numberArray[j]}[/size][/i] ${name} | ${team}\n`)
            }
        } else {
            let helper = results.nameArray[j];
            let n = helper.includes("|");
            if(!n){
                fs.appendFileSync(`${__dirname}/stats.txt`, `[color=#FF0000]${j+1}.[/color] [i][size=85]#${results.numberArray[j]}[/size][/i] ${helper}\n`)
            } else {
                let name = helper.substring(0,helper.indexOf("|"));
                let team = helper.substring(helper.indexOf("|")+1);
                fs.appendFileSync(`${__dirname}/stats.txt`, `[color=#FF0000]${j+1}.[/color] [i][size=85]#${results.numberArray[j]}[/size][/i] ${name} | ${team}\n`)
            }
        }
    }
    await browser.close();
}

async function lcq(title, url){
    let browser = await puppeteer.launch({headless: true});
    let page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080})
    await page.goto(url);
    await page.waitForTimeout(2000);
    fs.appendFileSync(`${__dirname}/stats.txt`, `\n[b][u]${title} Supercross LCQ[/b][/u]\n`);

    let results = await page.evaluate(() =>{
        function capitalize(str) {
            return str.replace(
                /\w\S*/g,
                function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1);
                }
            );
        }

        let position = document.querySelectorAll(`td.pos`);
        let numberArray = [];
        let nameArray = [];
        let posNum = position.length;

        for(let i=0;i<position.length;i++){
            numberArray[i] = document.querySelector(`table.laptimes:nth-child(5) > tbody:nth-child(1) > tr:nth-child(${i+2}) > td:nth-child(2)`).innerHTML;
            nameArray[i] = capitalize(document.querySelector(`table.laptimes:nth-child(5) > tbody:nth-child(1) > tr:nth-child(${i+2}) > td:nth-child(3) > a:nth-child(1)`).innerHTML);
        }
        return {numberArray, nameArray, posNum};
    });

    for(let j = 0; j<results.posNum;j++){
        if(j<4){
            let helper = results.nameArray[j];
            let n = helper.includes("|");
            if(!n){
                fs.appendFileSync(`${__dirname}/stats.txt`, `[color=#00BF00]${j+1}.[/color] [i][size=85]#${results.numberArray[j]}[/size][/i] ${helper}\n`)
            } else {
                let name = helper.substring(0,helper.indexOf("|"));
                let team = helper.substring(helper.indexOf("|")+1);
                fs.appendFileSync(`${__dirname}/stats.txt`, `[color=#00BF00]${j+1}.[/color] [i][size=85]#${results.numberArray[j]}[/size][/i] ${name} | ${team}\n`)
            }
        } else {
            let helper = results.nameArray[j];
            let n = helper.includes("|");
            if(!n){
                fs.appendFileSync(`${__dirname}/stats.txt`, `[color=#FF0000]${j+1}.[/color] [i][size=85]#${results.numberArray[j]}[/size][/i] ${helper}\n`)
            } else {
                let name = helper.substring(0,helper.indexOf("|"));
                let team = helper.substring(helper.indexOf("|")+1);
                fs.appendFileSync(`${__dirname}/stats.txt`, `[color=#FF0000]${j+1}.[/color] [i][size=85]#${results.numberArray[j]}[/size][/i] ${name} | ${team}\n`)
            }
        }
    }
    await browser.close();
}

async function mains(title, url){
    let browser = await puppeteer.launch({headless: true});
    let page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080})
    await page.goto(url);
    await page.waitForTimeout(2000);
    fs.appendFileSync(`${__dirname}/stats.txt`, `\n[b][u]${title} Supercross Main Event[/b][/u]\n`);

    let results = await page.evaluate(() =>{
        function capitalize(str) {
            return str.replace(
                /\w\S*/g,
                function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1);
                }
            );
        }

        let position = document.querySelectorAll(`td.pos`);
        let numberArray = [];
        let nameArray = [];
        let posNum = position.length;

        for(let i=0;i<position.length;i++){
            numberArray[i] = document.querySelector(`table.laptimes:nth-child(5) > tbody:nth-child(1) > tr:nth-child(${i+2}) > td:nth-child(2)`).innerHTML;
            nameArray[i] = capitalize(document.querySelector(`table.laptimes:nth-child(5) > tbody:nth-child(1) > tr:nth-child(${i+2}) > td:nth-child(3) > a:nth-child(1)`).innerHTML);
        }
        return {numberArray, nameArray, posNum};
    });

    for(let j = 0; j<results.posNum;j++){
        let helper = results.nameArray[j];
        let n = helper.includes("|");
        if(!n){
            fs.appendFileSync(`${__dirname}/stats.txt`, `${j+1}. [i][size=85]#${results.numberArray[j]}[/size][/i] ${helper}\n`)
        } else {
            let name = helper.substring(0,helper.indexOf("|"));
            let team = helper.substring(helper.indexOf("|")+1);
            fs.appendFileSync(`${__dirname}/stats.txt`, `${j+1}. [i][size=85]#${results.numberArray[j]}[/size][/i] ${name} | ${team}\n`)
        }
    }
    await browser.close();
}

async function points250w(){
    let browser = await puppeteer.launch({headless: true});
    let page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080})
    await page.goto(qualurl);
    await page.waitForTimeout(2000);
    fs.appendFileSync(`${__dirname}/stats.txt`, `\n[b][u]250 West Supercross[/b][/u]\n`);

    let points = await page.evaluate(() =>{
        function capitalize(str) {
            return str.replace(
                /\w\S*/g,
                function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }
        let numberArray = [];
        let nameArray = [];
        let pointArray = [];
        //#standings-2 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(5)
        //#standings-2 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(2) > td:nth-child(5)
        for(let i=0;i<20;i++){
            numberArray[i] = document.querySelector(`#standings-2 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(2)`).innerHTML;
            nameArray[i] = capitalize(document.querySelector(`#standings-2 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(3)`).innerHTML);
            pointArray[i] = document.querySelector(`#standings-2 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(5)`).innerHTML;
        }
        return {numberArray, nameArray, pointArray};
    });
    for(let j = 0; j<20;j++){
        fs.appendFileSync(`${__dirname}/stats.txt`, `${j+1}. [i][size=85]#${points.numberArray[j]}[/size][/i] - ${points.nameArray[j]} - [i]${points.pointArray[j]}[/i] | [size=85][color=#FF0000]Team[/color][/size] \n`)
    }
    await browser.close();
}

async function points250e(){
    let browser = await puppeteer.launch({headless: true});
    let page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080})
    await page.goto(qualurl);
    await page.waitForTimeout(2000);
    fs.appendFileSync(`${__dirname}/stats.txt`, `\n[b][u]250 East Supercross[/b][/u]\n`);

    let points = await page.evaluate(() =>{
        function capitalize(str) {
            return str.replace(
                /\w\S*/g,
                function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }
        let numberArray = [];
        let nameArray = [];
        let pointArray = [];
        //#standings-2 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(5)
        //#standings-2 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(2) > td:nth-child(5)
        //#standings-1 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2)
        for(let i=0;i<20;i++){
            numberArray[i] = document.querySelector(`#standings-3 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(2)`).innerHTML;
            nameArray[i] = capitalize(document.querySelector(`#standings-3 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(3)`).innerHTML);
            pointArray[i] = document.querySelector(`#standings-3 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(5)`).innerHTML;
        }
        return {numberArray, nameArray, pointArray};
    });
    for(let j = 0; j<20;j++){
        fs.appendFileSync(`${__dirname}/stats.txt`, `${j+1}. [i][size=85]#${points.numberArray[j]}[/size][/i] - ${points.nameArray[j]} - [i]${points.pointArray[j]}[/i] | [size=85][color=#FF0000]Team[/color][/size] \n`)
    }
    await browser.close();
}

async function points450(){
    let browser = await puppeteer.launch({headless: true});
    let page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080})
    await page.goto(qualurl);
    await page.waitForTimeout(2000);
    fs.appendFileSync(`${__dirname}/stats.txt`, `\n[b][u]450 Supercross[/b][/u]\n`);

    let points = await page.evaluate(() =>{
        function capitalize(str) {
            return str.replace(
                /\w\S*/g,
                function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }
        let numberArray = [];
        let nameArray = [];
        let pointArray = [];
        //#standings-2 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(5)
        //#standings-2 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(2) > td:nth-child(5)
        //#standings-1 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2)
        for(let i=0;i<20;i++){
            numberArray[i] = document.querySelector(`#standings-1 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(2)`).innerHTML;
            nameArray[i] = capitalize(document.querySelector(`#standings-1 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(3)`).innerHTML);
            pointArray[i] = document.querySelector(`#standings-1 > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(${i+1}) > td:nth-child(5)`).innerHTML;
        }
        return {numberArray, nameArray, pointArray};
    });
    for(let j = 0; j<20;j++){
        fs.appendFileSync(`${__dirname}/stats.txt`, `${j+1}. [i][size=85]#${points.numberArray[j]}[/size][/i] - ${points.nameArray[j]} - [i]${points.pointArray[j]}[/i] | [size=85][color=#FF0000]Team[/color][/size] \n`)
    }
    await browser.close();
}