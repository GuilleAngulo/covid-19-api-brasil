const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');



const { host, port, user, pass, service } = require('../config/mail.json');

var transport = nodemailer.createTransport({
    host,
    port,
    service,
    auth: { user, pass },
  });


 transport.use('compile', hbs({
    viewEngine: {
        extName: '.html',
        partialsDir: path.resolve('./src/resources/mail/'),
        layoutsDir: path.resolve('./src/resources/mail/'),
        defaultLayout: '',
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
  }));


  module.exports = transport;