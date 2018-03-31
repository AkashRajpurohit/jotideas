const csrf = require('csurf');
const bodyParser = require('body-parser');

// CSRUF Middleware
const csrfProtection = csrf({ cookie: false })
const parseForm = bodyParser.urlencoded({ extended: false })

module.exports = {
  csrfProtection : csrfProtection,
  parseForm : parseForm
}