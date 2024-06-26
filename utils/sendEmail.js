const nodemailer = require("nodemailer");
const patientModel = require("../models/PatientModel");
const userModel = require("../models/UserModel");
const ReferralModel = require("../models/ReferralModel");

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
    const imageUrl = "https://res.cloudinary.com/dxa2sfens/image/upload/v1704871962/samples/yzj44igafl1acu9pguvt.png";

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
      <a href="https://umehealth.co.uk/">
      <img src="${imageUrl}" alt="UME Health Image" style="height: 50px;"/>
  </a>
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

const referralConfirmation = async (name, email, subject, pdfLink) => {
    const imageUrl = "https://res.cloudinary.com/dxa2sfens/image/upload/v1704871962/samples/yzj44igafl1acu9pguvt.png";

    const emailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Referral created</title>
    </head>
    <body>
      <p>Hello!</p>
    
    
      <p>A new referral request has been submitted by ${name} and you can access it by clicking on <a href="www.refer.umehealth.co.uk">www.refer.umehealth.co.uk</a> Please contact the patient directly to confirm the appointment date and time.
      </p>
    
      <p>Regards,<br>
      UME Health Client Relations Team</p>
      <a href="https://umehealth.co.uk/">
      <img src="${imageUrl}" alt="UME Health Image" style="height: 50px;"/>
  </a>
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
        subject: ` New referral from ${name}`,
        html: emailHtml,
    });
    if (resp) {
        console.log("Email sent Successfully");
    } else {
        console.log("Email sent Failure");
    }
}
const referralConfirmed = async (name, email, subject, pdfLink) => {

    const imageUrl = "https://res.cloudinary.com/dxa2sfens/image/upload/v1704871962/samples/yzj44igafl1acu9pguvt.png";
    const emailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title></title>
    </head>
    <body>
      <p>Hello ${name},</p>
    
    
      <p>UME Health has received your imagining referral and we will get back to you shortly. Rest assured your referral is in safe hands. If you do need to get in touch, please email  <a href="mailto:bookings@umegroup.com">bookings@umegroup.com</a></p>
    
      <p>Regards,<br>
      UME Health Client Relations Team</p>
      <p>
      <a href="https://umehealth.co.uk/">
      <img src="${imageUrl}" alt="UME Health Image" style="height: 50px;"/>
  </a>
      <br>
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
        subject: "Referral confirmation - your referral has been received",
        html: emailHtml,
    });
    if (resp) {
        console.log("Email sent Successfully");
    } else {
        console.log("Email sent Failure");
    }
};
const referralConfirm = async (name, email, subject, pdfLink, name1) => {



    const imageUrl = "https://res.cloudinary.com/dxa2sfens/image/upload/v1704871962/samples/yzj44igafl1acu9pguvt.png";


    const emailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Referral eated</title>
    </head>
    <body>
      <p>Hello ${name},</p>
    
    
      <p>UME Health has received an imagining referral for you submitted by ${name1}.
       Our bookings team will be in touch with you to book your appointment.
        Rest assured your referral is in safe hands. If you do need to get in touch,
         please email  <a href="mailto:bookings@umegroup.com">bookings@umegroup.com</a></p>
    
      <p>Regards,<br>
      UME Health Client Relations Team</p>
      <p>
      <a href="https://umehealth.co.uk/">
      <img src="${imageUrl}" alt="UME Health Image" style="height: 50px;"/>
  </a>      <br>
      17 Harley Street, Marylebone, London W1G 9QH<br>
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

const informConsultant = async (name, email, subject, pdfLink, id) => {

    const patient = await ReferralModel.findOne({ _id: id });
    const patientName = patient.title + " " + patient.firstName + " " + patient.lastName;

    const user = await userModel.findOne({
        _id: patient.consultant.toString(),
    });
    const imageUrl = "https://res.cloudinary.com/dxa2sfens/image/upload/v1704871962/samples/yzj44igafl1acu9pguvt.png";

    const emailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Referral createded</title>
    </head>
    <body>
      <p>Dear ${name} </p>
    
    
      <p>UME Health has uploaded  ${patientName} report to the 
      <a href="www.refer.umehealth.co.uk">www.refer.umehealth.co.uk   </a>and you will find it under the “My Referrals” tab. 

If you need any further assistance, please send us an email at   <a href="clientrelations@umegroup.com">clientrelations@umegroup.com</a>

 </p>
    
      <p>Regards,<br>
      UME Health Client Relations Team</p>
      <p>
      <a href="https://umehealth.co.uk/">
      <img src="${imageUrl}" alt="UME Health Image" style="height: 50px;"/>
  </a>
       <br>
      
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
        subject: "Re: Your patient’s imaging report is ready",
        html: emailHtml,
    });
    if (resp) {
        console.log("Email sent Successfully");
    } else {
        console.log("Email sent Failure");
    }
};


const informPatient = async (name, email, subject, pdfLink, id) => {

    const patient = await ReferralModel.findOne({ _id: id });
    /*     const patientName = patient.title + " " + patient.firstName + " " + patient.lastName;
 */
    const date = patient.appoinmentDate;
    const time = patient.time;


    const user = await userModel.findOne({
        _id: patient.consultant.toString(),
    });
    const imageUrl = "https://res.cloudinary.com/dxa2sfens/image/upload/v1704871962/samples/yzj44igafl1acu9pguvt.png";

    const emailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Referral createded</title>
    </head>
    <body>
      <p>Dear ${name} </p>
    
    
      <p>We are pleased to inform you that your appointment at UME Health has been confirmed for   ${date} at ${time}. Your health and well-being are our top priorities, and we are dedicated to providing you with the best care possible.

If you need any further assistance, please send us an email at   <a href="clientrelations@umegroup.com">clientrelations@umegroup.com</a>

 </p>
    
      <p>Regards,<br>
      UME Health Client Relations Team</p>
      <p>
      <a href="https://umehealth.co.uk/">
      <img src="${imageUrl}" alt="UME Health Image" style="height: 50px;"/>
  </a>
         <br>
      
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
        subject: "Re: Your appointment with UME Health, 17 Harley Street",
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
    informPatient,
    referralConfirmed,
};
