import nodemailer from 'nodemailer'

const sendMail = async(otp,mail)=>{

  try {

    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});


  const mailOptions = {
    from: process.env.EMAIL,
    to: mail,
    subject: "Your OTP Code",
    html: `<h2>Your OTP is: ${otp}</h2>`,
  };

  await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.log("failed to send otp",error)
  }
}


export default sendMail