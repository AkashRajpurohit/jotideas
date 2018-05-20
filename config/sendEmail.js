const nodemailer = require("nodemailer");

exports.sendEmail = function(name, email, token, url) {
  const output = `
  <h1>Hello ${name}</h1><br />
  <p>Confirm your account!</p>
  <p>Click on this URL</p>
  <a href="${url}/users/activateaccount/${token}" target="_blank">${url}/users/activateaccount/${token}</a>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtpout.asia.secureserver.net",
    port: 3535,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"JotIdeas" <akashrajpurohit@codewithitguy.com>', // sender address
    to: email, // list of receivers
    subject: "Confirm Your Account", // Subject line
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  });
};
