import nodemailer from 'nodemailer'

const sendMail = async(otp:number|string,mail:string)=>{

  try {

    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.APP_PASSWORD as string,
  },
});


  const mailOptions = {
    from: process.env.EMAIL as string,
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