#  Brasil COVID-19 Cases API (Under Construction 🚧)

This project was created to have an updated API with the cases of COVID-19 in Brazil, according to the official site of the [Ministry of Health](http://covid.saude.gov.br/). The project has been developed in Node.js and MongoDB and it provides an API to be consumed serving updated data of confirmed and deaths cases. In order retrieve the data from the Ministry web it is used a scheduled cron.

## Retrieving official data - Update Service cron
One of the main parts of the project is the automation for having the database updated. The code is under */src/app/services/UpdateService.js*: The cron is scheduled to run everyday at 18:00h and 00:00h: the data of the official site is commonly updated around 18:00h, and in case this update delays for any reason it will be updated at midnight.

When the cron starts, using [Pupeeter](https://github.com/puppeteer/puppeteer) in order to navigate the site as a browser, it is examinate the last update time at https://covid.saude.gov.br/. If the time isn´t more recent than the stored update time at the database then nothing else is triggered, everything is up to date. Otherwise, if the update time is more recent than the stored time, the next step is triggered: The CSV file is downloaded (at a temporal folder) and it is parsed into an array of JSON objects to override the data stored at the database.

<img src="https://github.com/GuilleAngulo/covid-19-api-brasil/blob/master/src/resources/pupeeter.png" width="900">
> Using Pupeeter the updated time is checked and if the data is not up to date the button is clicked to download the CSV file


## API Documentation - Swagger
It is used [Swagger](https://swagger.io/) to make a proper documentation of the API and capable of allow live tests. It is accessible at **http://localhost:3000/docs** in case you run the project at your computer.

<img src="https://github.com/GuilleAngulo/covid-19-api-brasil/blob/master/src/resources/Swagger1.png" width="400">
<img src="https://github.com/GuilleAngulo/covid-19-api-brasil/blob/master/src/resources/Swagger2.png" width="400">

## Validation and Testing
The project uses [Celebrate](https://github.com/arb/celebrate) to implement validators at a middleware in order to check that the inputs of the requests are valid (at *src/app/validators*). Also it is used [Jest](https://jestjs.io/) to make both unit testing and integration (with database) testing using mocks.

## API



### Get State

Finds state by UF code

```http
GET /state/:code
```

| Parameter | In | Type | Description |
| :--- | :--- | :--- | :--- |
| `code` | `path` | `string` | **Required**. UF code of Brazil |

Responses

```javascript
{
  "_id": string,
  "name": string,
  "code": string,
  "population": number,
  "region": string,
  "createdAt": date,
  "updatedAt": date,
  "__v": number,
  "confirmed": number,
  "deaths": number,
  "officialUpdated": date
}
```

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` | 
| 201 | `CREATED` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |
