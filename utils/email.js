const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Phan Công Long <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      //Activate in gmail "less secure app" option
    });
  }

  async send(template, subject) {
    //Send the actual email
    // 1) Render HTML, based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // 2) Define email option
    const mailOption = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
      // html:
    };

    // 3) Create a transport and send email

    await this.newTransport().sendMail(mailOption);
  }
  async sendWelcome() {
    await this.send(`_welcome`, 'Welcome to the Natours family');
  }
  async sendPasswordReset() {
    await this.send(
      '_passwordReset',
      'Your password reset token for only 10 minutes'
    );
  }
}

module.exports = Email;
