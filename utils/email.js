const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = 'Hazem Hamed <hello@hazem.io';
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return 1;
    }
    // Mailtrap
    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 587,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: htmlToText.convert(html),
    };
    await this.createTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
