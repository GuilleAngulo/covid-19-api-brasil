const State = require('../models/State');

const puppeteer = require('puppeteer');
const COMUNICATIONS_URL = 'https://www.saude.gov.br/noticias';
const LINK_WORDS = ['Coronavírus: ', 'mortes', 'casos confirmados'];


    // Clean Searched Words
    function cleanText(linkText) {
        linkText = linkText.replace(/\r\n|\r/g, "\n");
        linkText = linkText.replace(/\ +/g, " ");
        // Replace &nbsp; with a space 
        const nbspPattern = new RegExp(String.fromCharCode(160), "g");
        return linkText.replace(nbspPattern, " ");
    }

    // Click Link found by Searched Words
    const clickLink = async (page, textArray) => {
        // Text contains all searched strings
        const xPath = `//a[${textArray.map((text, index) => {
            if (index === 0) return `contains(text(), "${cleanText(text)}")`
            return `and contains(text(), "${cleanText(text)}")`
        }).join(' ')}]`

        const linkHandlers = await page.$x(xPath);

        if (linkHandlers.length > 0) {
            console.log('Link found. Accessing...');
            await linkHandlers[0].click();
            await page.waitForNavigation({waitUntil: 'load'});
            console.log("Current page:", page.url());
        } else {
            throw new Error(`Link not found for words: ${textArray.map(text => text)}`);
        }
    };


    async function getDate(page) {
        try {
            console.log('Getting update time...');
            const [dateElement] = await page.$x('//span[@class="documentPublished"]')
            const date = await dateElement.getProperty('textContent');
            let dateString = await date.jsonValue();
            const strArray = dateString.split(',');
            const dateArray = strArray[1].trim().split(' ');
            const months= ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho",
                "Agosto","Setembro","Outubro","Novembro","Dezembro"];
            let month = months.indexOf(dateArray[2]) + 1;

            if (month > 0) {
                const year =  dateArray[4];
                month = (month) < 10 ? '0' + month : month;
                const day = dateArray[0];
                const hoursArray = strArray[2].trim().split('h');
                return new Date(year, month, day, hoursArray[0], hoursArray[1]);
                
            } else {
                throw new Error('Month not valid: Not matching portuguese names.');
            }
        } catch (error) {
            throw new Error('Date format has changed. Function deprecated.', error);
        }
    }

    // Receiving 2D Array Table returns an Object Array with the database fields.
    function parseTable(arrayTable, update) {
        console.log('Parsing the table data...');
        //Check if headers are ok
        if ( arrayTable[0][0] === "ID" && arrayTable[0][1] === "UF" 
            && arrayTable[0][2] === "CONFIRMADOS" && arrayTable[0][3] === "ÓBITOS") {
    
                const cleanTable = [];
                for (let i = 0; i < arrayTable.length; i++) {
                        if (arrayTable[i].length === 5) {
                            cleanTable.push({ 
                                "code": arrayTable[i][1], 
                                "confirmed": arrayTable[i][2], 
                                "deaths": arrayTable[i][3],
                                "officialUpdated": update,
                            });
                        }
                }
                return cleanTable;
                
        } else {
            throw new Error('Invalid table format. Header does not match.');
        }
      }

      async function updateDatabase(data) {
          ('Updating database...');
          data.map(async (stateUpdate) => {
            try {

                const state = await State.findOneAndUpdate(
                    { code: stateUpdate.code.toUpperCase() }, 
                    { ...stateUpdate }, 
                    { new: true, useFindAndModify: false });
    
                await state.save();

            } catch (error) {
                throw new Error('Error updating state:', error);
            }
          });

          console.log('Database succesfully updated');
      }

      async function launchPage(url) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        console.log("Launching page:", url);
        return page;
      }

      async function getTable(page) {
        return table = await page.evaluate(() => {
            const rows = document.querySelectorAll('table tr');
            return Array.from(rows, row => {
              const columns = row.querySelectorAll('td');
              return Array.from(columns, column => column.innerText);
            });
        });
      }

    module.exports = {
        
        async index() {
            console.log('Starting...');
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            try {
                //const page = await launchPage(COMUNICATIONS_URL);
                await page.goto(COMUNICATIONS_URL);
                console.log("Launching page:", COMUNICATIONS_URL);
                await clickLink(page, LINK_WORDS);
                const update = await getDate(page);
                const table = await getTable(page);
                const data = parseTable(table, update);
                await updateDatabase(data);
                
            } catch (error) {
                console.error(error);
            }
            await browser.close();
            console.log('Browser closed');
        }
    };
    
