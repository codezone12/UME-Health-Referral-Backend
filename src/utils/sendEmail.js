const nodemailer = require('nodemailer')
module.exports = async (email, name, subject, otp) => {
    try {
        const emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Email</title>
        </head>
        <body>
            <p>Hello ${name},</p>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 1 Hour.</p>
            <p>Thank you!</p>
        </body>
        </html>
    `;
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth : {
                user: process.env.USER,
                pass : process.env.PASSWORD
            }
        })
        await transporter.sendMail({
            to : email,
            subject : subject,
            html: emailHtml
        })
        console.log('Email sent Successfully');
    } catch (error) {
        console.log(`Email not sent ${error}`);
    }
}