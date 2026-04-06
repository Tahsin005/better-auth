import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.GMAIL_USER!,
        pass: process.env.GMAIL_APP_PASSWORD!,
    },
});

export async function sendEmail({
    to,
    subject,
    html,
    text,
}: {
    to: string;
    subject: string;
    html: string;
    text: string;
}) {
    return transporter.sendMail({
        from: `"Better Auth" <${process.env.GMAIL_USER!}>`,
        to,
        subject,
        html,
        text,
    });
}