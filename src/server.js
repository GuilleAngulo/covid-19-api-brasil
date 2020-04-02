const app = require('./app');

const { cron } = require('./app/services/UpdateService');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
    //cron();
 });