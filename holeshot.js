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
        let leaders = await page.evaluate(()=>{

            let leader = document.querySelector("table.laptimes:nth-child(7) > tbody:nth-child(1) > tr:nth-child(2)").querySelectorAll("td");
            //let leaderArray = [];
            for (let i=0; i<leader.length; i++){
                leaderArray[i] = {
                    lap: i+1,
                    leader: parseInt(leader[i].innerText, 10)
                };
            }
            return {leader};
        })
        await console.log(leaders);




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