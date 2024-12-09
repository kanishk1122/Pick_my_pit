const nodemailer = require('nodemailer');
require('dotenv').config();
const handlebars = require('handlebars');
const fs = require('fs-extra');
const path = require('path');

// Create a transporter object
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
});

console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);





// Function to send an email
const sendConfimationEmail = async (userName, userEmail, confirmationLink) => {
    console.log(__dirname,  'emailConfirmation.html',"this pth")
    try {
        const templatePath = path.join(__dirname, 'Email', 'confirmationemail.html');
        const emailTemplate = await fs.readFile(templatePath, 'utf-8');
        const compiledTemplate = handlebars.compile(emailTemplate);

        const emailContent = compiledTemplate({
            userName,
            confirmationLink,
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Confirm Your Email',
            html: emailContent,
            text: 'Email Confirmation', // plain text body
        });
        console.log('sender sent: %s', process.env.EMAIL_USER);
        console.log('Message sent: %s', info.messageId);
        console.log('Email sent: %s', userEmail);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const wellcomeEmail = async (userName, userEmail) => {
    console.log(__dirname,  'wellcome.html',"this pth")
    try {
        const templatePath = path.join(__dirname, 'Email', 'wellcome.html');
        const emailTemplate = await fs.readFile(templatePath, 'utf-8');
        const compiledTemplate = handlebars.compile(emailTemplate);

        const emailContent = compiledTemplate({
            userName,
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Wellcome to our website',
            html: emailContent,
            text: 'Wellcome to our Community', // plain text body
        });
        console.log('sender sent: %s', process.env.EMAIL_USER);
        console.log('Email sent: %s', userEmail);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};



module.exports = {sendConfimationEmail , wellcomeEmail};
