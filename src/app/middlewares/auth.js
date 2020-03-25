const authConfig = require('../../config/auth');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send({ error: 'No token provided.'});

    if (authHeader !== authConfig.secret) {
        return res.status(401).send({ error: 'Token invalid.' });
       
    } else return next();
 };