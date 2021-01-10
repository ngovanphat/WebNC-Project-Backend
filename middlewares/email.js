var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendResetPasswordEmail = (email, code) => {
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Online Academy Verification",
    text: "Your Verification code for Online Academy : " + code,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendConfirmChangePasswordEmail = (email, code) => {
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Online Academy Password Change Notification",
    text: "Your password on Online Academy has been changed.",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendConfirmAccountCreatedEmail = (email, code) => {
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Welcome to Online Academy",
    text: "Your account has been created successfully.",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendResetPasswordEmail, sendConfirmChangePasswordEmail, sendConfirmAccountCreatedEmail };