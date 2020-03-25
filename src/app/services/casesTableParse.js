const State = require('../models/State');

const puppeteer = require('puppeteer');
const COMUNICATIONS_URL = 'https://www.saude.gov.br/noticias';

    // Normalizing the text
    function getText(linkText) {
        linkText = linkText.replace(/\r\n|\r/g, "\n");
        linkText = linkText.replace(/\ +/g, " ");
    
        // Replace &nbsp; with a space 
        const nbspPattern = new RegExp(String.fromCharCode(160), "g");
        return linkText.replace(nbspPattern, " ");
    }

    const clickByText = async (page, textArray) => {
        
        // Text contains all searched strings
        const xPath = `//a[${textArray.map((text, index) => {
            if (index === 0) return `contains(text(), "${getText(text)}")`
            return `and contains(text(), "${getText(text)}")`
        }).join(' ')}]`

        //const linkHandlers = await page.$x(`//a[contains(text(), ${linkText}) and contains(text(), 'casos confirmados')]`);
        const linkHandlers = await page.$x(xPath);

        //const date = await page.$x(xPath + `/ancestor::div[@class="tileItem"]/div[@class="tileInfo"]/ul/li[2]/text()]`);
        //const el = await page.$x(xPath + `/ancestor::div[@class="tileItem"]/div[@class="tileContent"]/span[@class="subtitle"]`);
        //console.log(el[0]);
        //const date = await el.getProperty('textContent');
        //const dateJSON = await date.jsonValue();
        //console.log(dateJSON);
        if (linkHandlers.length > 0) {
        await linkHandlers[0].click();


        } else {
        throw new Error(`Link not found: ${text}`);
        }
    };

    
    async function scrape(url) {
        console.log('SCRAPING site ', url);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        try {
            await clickByText(page, ['Coronavírus: ', 'mortes', 'casos confirmados']);
            await page.waitForNavigation({waitUntil: 'load'});
            //console.log("Current page:", page.url());
            const data = await page.evaluate(() => {
                const tds = Array.from(document.querySelectorAll('table tr td'))
                return tds.map(td => td.innerHTML)
            });
        
            //You will now have an array of strings
            //[ 'One', 'Two', 'Three', 'Four' ]
            console.log(data);
            
        } catch (error) {
            console.log('Error accesing page element: ', error);
        }
        await browser.close();

    }


scrape(COMUNICATIONS_URL);