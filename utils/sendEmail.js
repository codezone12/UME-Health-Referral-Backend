const nodemailer = require("nodemailer");
const otpMail = async (email, name, subject, otp) => {
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
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD,
            },
        });
        await transporter.sendMail({
            to: email,
            subject: subject,
            html: emailHtml,
        });
        console.log("Email sent Successfully");
    } catch (error) {
        console.log(`Email not sent ${error}`);
    }
};

const otpRequest = async (firstName, lastName, otp, email, subject) => {
    const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your UME Health OTP Request</title>
    </head>
    <body>
      <p>Dear ${firstName},</p>
    
      <p>Thank you for registering on the UME Health patients referral portal. Your OTP is <strong>${otp}</strong>, please use it to complete your registration on our platform.</p>
    
      <p>If you need any further assistance, please send us an email at <a href="mailto:clientrelations@umegroup.com">clientrelations@umegroup.com</a></p>
    
      <p>Regards,<br>
      UME Health Client Relations Team</p>
    </body>
    </html>    
    `;

    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.SECURE),
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
        },
    });
    const resp = await transporter.sendMail({
        to: email,
        subject: subject,
        html: emailHtml,
    });
    if (resp) {
        console.log("Email sent Successfully");
    } else {
        console.log("Email sent Failure");
    }
};

const referralConfirmation = async (firstName, lastName, title, email, subject, pdfLink) => {
    const name = title + " " + firstName + " " + lastName;
    const emailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Referral created</title>
    </head>
    <body>
    <p> Hellouuu! ${name},</p>
    
    
      <p>UME Health has received an imagining referral for you submitted by<strong> ${name} </strong>. Our bookings team will be in touch with you to book your appointment. Rest assured your referral is in safe hands. If you do need to get in touch, please email <a href="mailto:bookings@umegroup.com">bookings@umegroup.com</a></p>
    
      <p>Regards,<br>
      UME Health Client Relations Team</p>
      <p>
      17 Harley Street, Marylebone, London W1G 9QH<br>
      Telephone: 0207 467 6190<br>
      Email: <a href="mailto:bookings@umegroup.com">bookings@umegroup.com</a><br>
      Web: www.umehealth.co.uk<br>
    </p> 
    
    <h6>Disclaimer and Confidentiality Note:</h6>

    <p>Everything in this email and any attachments relating to the official business of UME Group LLP is proprietary to the company.</p>

    <p>It is confidential, legally privileged by law. UME does not own and endorse any other content. Views and opinions are those of the sender unless clearly stated as being that of UME Group.</p>

    <p>The person addressed in the email is the sole authorized recipient. Please notify the sender immediately if it has unintentionally reached you and do not read, disclose or use the content in any way. Please destroy the communication and all attachments immediately.</p>

    <p>UME Group cannot assure that the integrity of this communication has been maintained or that it is free from errors, virus, interception or interference.</p>

    <p>UME Group LLP, 17 Harley St, London W1G 9QH, Tel: 020 7391 8660 Fax: 020 7391 8666
    Registered in the UK. Registration number: OC333533</p>
    </body>
    </html>
    `;
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.SECURE),
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
        },
    });
    const resp = await transporter.sendMail({
        to: email,
        subject: subject,
        html: emailHtml,
    });
    if (resp) {
        console.log("Email sent Successfully");
    } else {
        console.log("Email sent Failure");
    }
};


const referralConfirm = async (firstName, email, subject, pdfLink) => {
    const emailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Referral created</title>
    </head>
    <body>
    <p> Hello! ${firstName},</p>
    
    
    <p>UME Health has received an imagining referral for you submitted by<strong> ${firstName} </strong>. Our bookings team will be in touch with you to book your appointment. Rest assured your referral is in safe hands. If you do need to get in touch, please email <a href="mailto:bookings@umegroup.com">bookings@umegroup.com</a></p>
    
      <p>Regards,<br>
      UME Health Client Relations Team</p>
      <p>
      17 Harley Street, Marylebone, London W1G 9QH<br>
      Telephone: 0207 467 6190<br>
      Email: <a href="mailto:bookings@umegroup.com">bookings@umegroup.com</a><br>
      Web: www.umehealth.co.uk<br>
    </div>
    
<p>
      <h6>Disclaimer and Confidentiality Note:</h6>

    Everything in this email and any attachments relating to the official business of UME Group LLP is proprietary to the company.

    It is confidential, legally privileged by law. UME does not own and endorse any other content. Views and opinions are those of the sender unless clearly stated as being that of UME Group.

    The person addressed in the email is the sole authorized recipient. Please notify the sender immediately if it has unintentionally reached you and do not read, disclose or use the content in any way. Please destroy the communication and all attachments immediately.

    UME Group cannot assure that the integrity of this communication has been maintained or that it is free from errors, virus, interception or interference.

    UME Group LLP, 17 Harley St, London W1G 9QH, Tel: 020 7391 8660 Fax: 020 7391 8666
    Registered in the UK. Registration number: OC333533
    </body>
    </html>
    `;
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.SECURE),
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
        },
    });
    const resp = await transporter.sendMail({
        to: email,
        subject: "Your appointment with UME Health, 17 Harley Street",
        html: emailHtml,
    });
    if (resp) {
        console.log("Email sent Successfully");
    } else {
        console.log("Email sent Failure");
    }
};

const informConsultant = async (name, email, subject, pdfLink) => {
    const emailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Re: Your UME Health Patient Referral</title>
    </head>
    <body>
      <p>Helloq!</p>
    
    
      <p>UME Health has submitted a patient referral and you can find it under the UME Health patients referral portal by clicking on www.refer.umehealth.co.uk. If you need any further assistance, please send us an email at <a href="mailto:clientrelations@umegroup.com">clientrelations@umegroup.com</a></p>
    
      <p>Regards,<br>
      UME Health Client Relations Team</p>
    </body>
    </html>
    `;
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.SECURE),
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
        },
    });
    const resp = await transporter.sendMail({
        to: email,
        subject: subject,
        html: emailHtml,
    });
    if (resp) {
        console.log("Email sent Successfully");
    } else {
        console.log("Email sent Failure");
    }
};
module.exports = {
    otpMail,
    otpRequest,
    referralConfirmation,
    referralConfirm,
    informConsultant,
};
