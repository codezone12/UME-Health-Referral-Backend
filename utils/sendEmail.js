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
      <p>Dear ${(firstName, " ", lastName)},</p>
    
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

const referralConfirmation = async (name, email, subject) => {
  const emailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>A new UME Health referral has been created</title>
    </head>
    <body>
      <p>Hello,</p>
    
      <p>A new referral request has been submitted by <strong>${name}</strong>. UME Health will aim to respond to the referral request within 48 hours.</p>
    
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

const referralConfirm = async (name, email, subject, pdfLink) => {
  const emailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your UME Health Patient Referral</title>
    </head>
    <body>
      <p>!Hello, ${name}</p>
    
    
      <p>UME Health has submitted a patient referral and you can find it under the UME Health patients referral portal by clicking on <a href="www.refer.umehealth.co.uk">www.refer.umehealth.co.uk</a> . 
      If you need any further assistance, please send us an email at <a href="mailto:clientrelations@umegroup.com">clientrelations@umegroup.com</a></p>
    
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

const resetPasswordEmail = async (resetUrl, email, subject) => {
  const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body>
        <p>Dear,</p>
      
        <p>Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: <a href=${resetUrl}>${resetUrl}</a> </p>
      
        <p>If you didn't forget your password, please ignore this email!</p>
      
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
  resetPasswordEmail,
};
