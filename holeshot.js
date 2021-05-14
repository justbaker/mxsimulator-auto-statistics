const puppeteer = require('puppeteer');
const chalk = require('chalk');
const fs = require('fs');

const error = chalk.bold.red;
const success = chalk.keyword("green");


(async () => {
    try{
        let browser = await puppeteer.launch({headless: true, slowMo: 200, devtools: true});
        let page = await browser.newPage();
        await page.goto(`http://mxsimulator.com/servers/official.mxslobby.com:19801/races/8515.html`);
        await page.setViewport({width: 1920, height: 1080})
        console.log('here1')

        let leaders = await page.evaluate(()=>{
            let leader = document.querySelector("body > div.main > table:nth-child(7) > tbody > tr:nth-child(2) > td:nth-child(2)");
            let leaderArray = [];
            for (let i=0; i<leader.length; i++){
                leaderArray.push(1);
            }
            return {leaderArray};
        })


        await fs.writeFile("leaders.json", JSON.stringify(leaders, undefined, 4), function(err){
            if (err) throw err;
            console.log("Saved results");
        })

        await browser.close();
        console.log(success("Browser Closed with"));
    } catch (err){
        console.log(error(err));
        //await browser.close();
        console.log(error("Browser Closed"));
    }
})();