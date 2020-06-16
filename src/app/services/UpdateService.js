const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const { CronJob } = require('cron');

const State = require('../models/State');

const { createDirectory, cleanDirectory } = require('../utils/directory');
const { createUpdateLogger } = require('../utils/log');
const { formatDate, matchDateInText } = require('../utils/date');

// PAGE SPECIFIC VALUES
const { URL, UPDATE_XPATH, DONWLOAD_BUTTON_XPATH, DOCUMENT_HEADER_TEXT } = require('../utils/website-data');

const TEMP_PATH = path.resolve(__dirname, '..', 'temp');

const LOG_PATH = path.resolve(__dirname, '..', '..', 'log');
const logger = createUpdateLogger(LOG_PATH);

module.exports = {
    cron() {
        //Scheduled for everyday 18:00 and 00:00
        const job = new CronJob('00 18,00 * * *',
            async () => {
                logger.info('Starting update cron.');
                await index();
                logger.info('Cron job finished.');
            }, 
            null,
            true, 
            'America/Sao_Paulo');
        //Testing cron next schedules
        //console.log(job.nextDates(5).map(date => date.toString()))  
        job.start();
    },
}

async function index() {
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
            logger.info('Database outdated. Downloading new data ...');
            await downloadCSVFile(page, DONWLOAD_BUTTON_XPATH);
            const data = csvToJSON(updateAt, TEMP_PATH);
            if (Array.isArray(data) && data.length) 
                await updateDatabase(data);
        } else {
            logger.info('Database up to date.');
        }
    } catch (error) {
        logger.error(error);
    }
    await browser.close();
    console.log('Browser closed');
}

    function csvToJSON(update, directoryPath) {
        console.log('Parsing CSV file to JSON...');
        const result = [];
        try {
            const date = formatDate(update);
            const files = fs.readdirSync(directoryPath);
            const file = fs.readFileSync(path.join(directoryPath, files[0]));
            const lines = file.toString().split("\r\n");
            // Check if header has correct format
            const header = lines[0].split(";");
            console.log(header[1], header[10], header[12]);
            if (header[1] === DOCUMENT_HEADER_TEXT.UF && header[10] === DOCUMENT_HEADER_TEXT.CONFIRMED && header[12] === DOCUMENT_HEADER_TEXT.DEATHS) {
                for (let i = 1; i < lines.length; i++) {
                    const currentline = lines[i].split(";");
                    if (currentline[7] === date) {
                        result.push({
                            "code": currentline[1], 
                            "confirmed": currentline[4], 
                            "deaths": currentline[6],
                            "officialUpdated": update,
                        });
                    }
                }
            } else {
                throw new Error('Header fields does not match the pattern.');
            }
        } catch (error) {
            logger.error('Error parsing CSV file:', error);
            console.error('Error parsing CSV file. Check the log.', error);
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


    async function downloadCSVFile(page, elementXPath) {
            if (fs.existsSync(TEMP_PATH)) cleanDirectory(TEMP_PATH);
            else createDirectory(TEMP_PATH);
            const [el] = await page.$x(elementXPath);
            await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: TEMP_PATH });
            await el.click({ delay: 100 });
            console.log('Downloading CSV file...');
            await page.waitFor(5000);
    }

    async function getUpdateAt(page, XPath) {
        console.log('Getting update time...');
        try {
            const [el] = await page.$x(XPath);
            const date = await el.getProperty('textContent');
            const dateJSON = await date.jsonValue();
            return matchDateInText(dateJSON);
        } catch (error) {
            logger.error('Error getting update time:', error);
        }
    }

    async function getStoredUpdate() {
        console.log('Getting stored update time...');
        const date = await State.aggregate(
            [
                { 
                    $group: {
                        _id: null, 
                        officialUpdated:  { $first: "$officialUpdated" },
                    }   
                }
            ]);

        return date[0].officialUpdated;;
    }
