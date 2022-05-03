import nodemailer from "nodemailer";
import "dotenv/config";

export async function sendMail(sendTo: string, text: string) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.EMAIL_ADDR, // generated ethereal user
            pass: process.env.EMAIL_PASS, // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from: '"Recipe Finder APP"',
        to: sendTo,
        subject: "PASSWORD RESET",
        html: text,
    });

    console.log("Message sent: %s", info.messageId);
}