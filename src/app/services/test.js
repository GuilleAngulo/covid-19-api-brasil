const puppeteer = require('puppeteer');
const BASE_URL = 'http://plataforma.saude.gov.br/novocoronavirus/';
const UPDATE_XPATH = '//*[@id="COVID-19-brazil"]/p/text()';



function reverseDate(dateString) {
    return dateString.split('/').reverse().join('/');
}


module.exports = {

    async getUpdateAt(page, XPath) {
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
            console.log('Error accesing page element: ', error);
        }
    
},

    async scrape(url) {
        console.log('SCRAPING site ', url);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const updateAt = getUpdateAt(page, UPDATE_XPATH);
        console.log(updateAt);
        if (updateAt && updateAt > storedUpdateAt) {
            //TODO Load all table data to database
        } else {
            //TODO answer with stored data
        }
        await browser.close();
    },
}

scrape(BASE_URL);

/*(() => {
    const dateJSON = "Dados atualizados em 18/03/2020 às 20:12";
    const dateRegex = /\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/g;
    const hourRegex =  /\d{2}:\d{2}/g;
    const dateString = reverseDate(dateJSON.match(dateRegex).toString());
    const timeString = dateJSON.match(hourRegex).toString();
    //const hourString = Number(timeString.substring(0, 2));
    //const minuteString = timeString.substring(3, 5);
    const updatedAt = new Date(timeString + ' ' + dateString);
    //updatedAt.setHours(hourString, minuteString);
    //updatedAt.setMinutes(minuteString);
    //updatedAt.setHours(updatedAt.getHours());
    const date2 = new Date();
    console.log(date2, updatedAt);
    console.log(updatedAt > date2);
    //const updatedAt = new Date(dateString);
    //console.log(updatedAt);
})()*/