const router = new require("express").Router();
const nodemailer = require("nodemailer");
const mail_host = "smtp.mailtrap.io";
const mail_host_port = 2525;
const mail_user_address = "08d6884ee2-96dd85@inbox.mailtrap.io";
const mail_user_name = "7f340b835d4d4a";
const mail_user_pass = "5b7a65d6c9c402";

async function sendMail(infos) {
    let transporter = nodemailer.createTransport({
        host: mail_host,
        port: mail_host_port,
        secure: false, // seras true pour 465, et false pour les autre ports
        auth: {
            user: mail_user_name, // généré éthérée utilisateur
            pass: mail_user_pass, // généré éthérée mot de passe
        },
    });

    let info = await transporter.sendMail({
        from: `${infos.email}`, // l'addresse de celui qui envoie
        to: mail_user_address, // la liste des personnes qui recoivent
        // email: infos.email,
        firstName: infos.firstName,
        lastName: infos.lastName,
        tel: infos.tel,
        subject: infos.subject, // le sujet du message
        text: infos.message, // le corps du message
        html: `<div> ${infos.lastName} <br> ${infos.firstName} <br> ${infos.tel} <br> ${infos.message} </div>`, // corps du html
    });
    console.log("Message envoyer: %s", info.messageId);
};

router.post("/", async (req, res, next) => {
    console.log(req.body);
    sendMail(req.body)
        .then(() => {
            console.log("?? reponse du mail");
            res.status(200).json("/contact");
        })
        .catch((err) => {
            console.error("????", err);
            res.status(500).json("/contact");
        });
});

module.exports = router;