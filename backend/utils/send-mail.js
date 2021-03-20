import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'


dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
    to: "abyproshopfromtwilio@gmail.com",
    from: "abyproshopfromtwilio@gmail.com",
    subject: "Welcome to Aby's Proshop, verify your email",
    text: `click the following link to activate your Proshop account and enjoy virtual shopping experience
           http://${req.headers.host}/verify-email?token=${user.emailToken}`,
    html: `
        <h1>Hello, </h1>
        <p>Thanks for registering on our site</p>
        <p>Please click the link bellow to verify and activate your Proshop account</p>
        <a href="http://${req.headers.host}/verify-email?Token=${user.emailToken}"> Verify your Account</a>
        <strong>Enjoy virtual shopping experience 🚀🚀🚀</strong>`

}
sgMail.send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })

