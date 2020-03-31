const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const State = require('../models/State');

const COMUNICATIONS_URL = 'https://covid.saude.gov.br/';
const UPDATE_XPATH = '//div[contains(@class, "card-total")][2]/div[2]/b';
const DONWLOAD_BUTTON_XPATH = '//div[@class="ok"]';

const TEMP_PATH = path.resolve(__dirname, '..', 'temp');

module.exports = {
    async index() {
        console.log('Starting...');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        try {
            console.log('Launching page: ', COMUNICATIONS_URL);
            await page.goto(COMUNICATIONS_URL);
            //Delay to print data
            await page.waitFor(5000);
            const updateAt = await getUpdateAt(page, UPDATE_XPATH);
            const storedUpdateAt = await getStoredUpdate();
            console.log('Page update:', updateAt);
            console.log('Database update:', storedUpdateAt);
            if (updateAt && updateAt > storedUpdateAt) {
                console.log('Database outdated. Starting update with new values...');
                await downloadCSVFile(page, DONWLOAD_BUTTON_XPATH);
                const data = csvToJSON(updateAt, TEMP_PATH);
                await updateDatabase(data);
        
            } else {
                console.log('Database updated.');
            }
        } catch (error) {
            console.error(error);
        }
        await browser.close();
        console.log('Browser closed');
    }
}

function csvToJSON(update, directoryPath) {
    console.log('Parsing CSV file to JSON...');
    const result = [];
    try {
        const month = update.getMonth() + 1;
        const date = `${update.getDate() < 10 ? '0' + update.getDate() : update.getDate()}/${month < 10 ? '0' + month : month }/${update.getFullYear()}`;
        const files = fs.readdirSync(directoryPath);
        const file = fs.readFileSync(path.join(directoryPath, files[0]));
        const lines = file.toString().split("\r\n");
        // Check if header has correct format
        const header = lines[0].split(";");
        if (header[1] === "estado" && header[4] === "casosAcumulados" && header[6] === "obitosAcumulado") {
            for (let i = 1; i < lines.length; i++) {
                const currentline = lines[i].split(";");
                if (currentline[2] === date) {
                    result.push({
                        "code": currentline[1], 
                        "confirmed": currentline[4], 
                        "deaths": currentline[6],
                        "officialUpdated": update,
                    });
                }
            }
        } else {
            console.error('Header fields does not match the pattern.');
        }
    } catch (error) {
        console.error('Error parsing CSV file:', error);
    }
    return result;
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


function cleanDirectory(directoryPath) {
    console.log('Cleaning temp folder...');
    fs.readdir(directoryPath, (err, files) => {
        if (err) console.error(`Error reading the folder at ${directoryPath}:`,err);
        for (let file of files) {
            fs.unlink(path.join(directoryPath, file), (err) => {
                if(err) console.error(`Error removing files at ${directoryPath}`,err);
            });
        }
    })
}

async function downloadCSVFile(page, ElementXPath) {
        cleanDirectory(TEMP_PATH);
        const [el] = await page.$x(ElementXPath);
        await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: TEMP_PATH });
        await el.click({ delay: 100 });
        console.log('Downloading CSV file...');
        await page.waitFor(5000);
}


function reverseDate(dateString) {
    return dateString.split('/').reverse().join('/');
}

async function getUpdateAt(page, XPath) {
    console.log('Getting update time...');
    try {
        const [el] = await page.$x(XPath);
        const date = await el.getProperty('textContent');
        const dateJSON = await date.jsonValue();
        const dateRegex = /\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/g;
        const hourRegex =  /\d{2}:\d{2}/g;
        const dateString = reverseDate(dateJSON.match(dateRegex).toString());
        const timeString = dateJSON.match(hourRegex).toString();
        return new Date(timeString + ' ' + dateString);
    } catch (error) {
        console.log('Error getting update time: ', error);
    }
}

async function getStoredUpdate() {
    console.log('Getting stored update time...');
    let result = '';
        await State.aggregate(
            [
                { 
                    $group: {
                        _id: null, 
                        officialUpdated:  { $first: "$officialUpdated" },
                    }   
                }
            ],
            (error, data) => {
                if (error) {
                    console.log('Error retrieving data from database', error);
                    return;
                }
                result = data[0].officialUpdated;
            }
        );
    return result;
}
