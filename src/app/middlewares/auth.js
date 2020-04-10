const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) 
        return res.status(401).send({ error: 'This operation needs authorization. Plase make login first at /user/authenticate' });

    const parts = authHeader.split(' ');

    if (!parts.lenght === 2)
        return res.status(401).send({ error: 'Token error.' });

    const [ scheme, token ] = parts;

    //Check if the part scheme starts with the regex 'Bearer'
    if (!/^Bearer$/i.test(scheme)) 
        return res.status(401).send({ error: 'Token malformed.'});

    
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token invalid.' });

        req.userId = decoded.id;
        return next();
    });
};