const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { CronJob } = require('cron');

const State = require('../models/State');

const { createDirectory, cleanDirectory } = require('../utils/directory');
const { createUpdateLogger } = require('../utils/log');

// PAGE SPECIFIC VALUES

const { URL, UPDATE_XPATH, DONWLOAD_BUTTON_XPATH, HEADER_TEXT } = require('../utils/website-data');

const TEMP_PATH = path.resolve(__dirname, '..', 'temp');

const LOG_PATH = path.resolve(__dirname, '..', '..', 'log');
const logger = createUpdateLogger(LOG_PATH);

module.exports = {
    async index() {
        console.log('Starting...');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        try {
            console.log('Launching page: ', URL);
            await page.goto(URL);
            //Delay to print data
            await page.waitFor(5000);
            const updateAt = await getUpdateAt(page, UPDATE_XPATH);
            const storedUpdateAt = await getStoredUpdate();
            console.log('Page update:', updateAt);
            console.log('Database update:', storedUpdateAt);
            if (updateAt && updateAt > storedUpdateAt) {
                logger.info('Database outdated. Starting update ...');
                await downloadCSVFile(page, DONWLOAD_BUTTON_XPATH);
                const data = csvToJSON(updateAt, TEMP_PATH);
                await updateDatabase(data);
        
            } else {
                logger.trace('Database up to date.');
            }
        } catch (error) {
            logger.error(error);
        }
        await browser.close();
        console.log('Browser closed');
    },

    cron() {
        //Scheduled for everyday 18:00 and 00:00
        //const job = new CronJob('00 18,00 * * *',
        const job = new CronJob('38 19 * * *',
        async () => {
            logger.info('Starting update cron.');
            await module.exports.index();
            logger.info('Cron job finished.');
        }, 
        null,
        true, 
        'America/Sao_Paulo');
        //Testing cron next schedules
        //console.log(job.nextDates(5).map(date => date.toString()))  
        job.start();
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
        if (header[1] === HEADER_TEXT.UF && header[4] === HEADER_TEXT.CONFIRMED && header[6] === HEADER_TEXT.DEATHS) {
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
            logger.error('Header fields does not match the pattern.');
        }
    } catch (error) {
        logger.error('Error parsing CSV file:', error);
    }
    //Remove CSV File
    cleanDirectory(directoryPath);
    return result;
}

async function updateDatabase(data) {
    console.log('Updating database...');
    data.map(async (stateUpdate) => {
      try {

          const state = await State.findOneAndUpdate(
              { code: stateUpdate.code.toUpperCase() }, 
              { ...stateUpdate }, 
              { new: true, useFindAndModify: false });

          await state.save();

      } catch (error) {
            logger.error('Error updating state:', error);
      }
    });

    console.log('Database succesfully updated');
}


async function downloadCSVFile(page, ElementXPath) {
        if (fs.existsSync(TEMP_PATH)) cleanDirectory(TEMP_PATH);
        else createDirectory(TEMP_PATH);
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
        logger.error('Error getting update time: ', error);
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
                logger.log('Error retrieving data from database', error);
                return;
            }
            result = data[0].officialUpdated;
        }
    );
    return result;
}
