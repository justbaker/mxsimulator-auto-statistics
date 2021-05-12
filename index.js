const puppeteer = require('puppeteer');
const chalk = require('chalk');
const fs = require('fs');

const error = chalk.bold.red;
const success = chalk.keyword("green");


(async () => {
    try{
        let browser = await puppeteer.launch({headless: true});
        let page = await browser.newPage();
        await page.setViewport({width: 1920, height: 1080})
        await page.goto(`http://mxsimulator.com/servers/official.mxslobby.com:19801/races/8515.html`);
        await page.waitForTimeout(2000);

        let results = await page.evaluate(()=>{
            let position = document.querySelectorAll(`td.pos`);
            let number = document.querySelectorAll(`td.no`);
            let name = document.querySelectorAll(`td.name`);
            let besttime = document.querySelectorAll(`td.besttime`);
            let resultArray = [];
            for (let i=0; i<position.length; i++){
                resultArray[i] = {
                    position: position[i].innerText,
                    number: number[i].innerText,
                    name: name[i].innerText,
                    besttime: besttime[i].innerText
                };
            }
            return resultArray;
        })

       await fs.writeFile("results.json", JSON.stringify(results, undefined, 4), function(err){
          if (err) throw err;
          console.log("Saved results");
       })
        console.log(success("Browser Closed"));
    } catch (err){
        console.log(error(err));
        //await browser.close();
        console.log(error("Browser Closed"));
    }
})();